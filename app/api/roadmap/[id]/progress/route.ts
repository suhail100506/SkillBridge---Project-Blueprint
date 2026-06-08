import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import RoadmapModel from "@/lib/db/models/Roadmap";
import UserModel from "@/lib/db/models/User";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { id } = params;

    const { taskId, completed } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch roadmap
    const roadmap = await RoadmapModel.findById(id);
    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Traverse phases, weeks, and tasks to find matching taskId
    let taskFound = false;
    let xpDiff = 0;
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    for (const phase of roadmap.phases) {
      for (const week of phase.weeks) {
        for (const task of week.tasks) {
          totalTasksCount += 1;
          
          if (task.id === taskId) {
            taskFound = true;
            // Determine XP difference
            if (completed && !task.completed) {
              task.completed = true;
              task.completedAt = new Date();
              xpDiff = task.xpReward || 10;
            } else if (!completed && task.completed) {
              task.completed = false;
              task.completedAt = null;
              xpDiff = -(task.xpReward || 10);
            }
          }

          if (task.completed) {
            completedTasksCount += 1;
          }
        }

        // Dynamically compute week status
        const weekTasks = week.tasks;
        const weekCompletedCount = weekTasks.filter((t: any) => t.completed).length;
        if (weekTasks.length > 0) {
          if (weekCompletedCount === weekTasks.length) {
            week.status = "completed";
            week.milestoneCompleted = true;
          } else if (weekCompletedCount > 0) {
            week.status = "in_progress";
            week.milestoneCompleted = false;
          } else {
            week.status = "not_started";
            week.milestoneCompleted = false;
          }
        }
      }
    }

    if (!taskFound) {
      return NextResponse.json({ error: "Task ID not found in roadmap" }, { status: 404 });
    }

    // Recalculate overall completion percentage
    const overallProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    
    roadmap.overallProgress = overallProgress;
    roadmap.earnedXP = Math.max(0, roadmap.earnedXP + xpDiff);
    roadmap.markModified("phases");
    
    // Save updated roadmap
    await RoadmapModel.findByIdAndUpdate(id, {
      overallProgress: roadmap.overallProgress,
      earnedXP: roadmap.earnedXP,
      phases: roadmap.phases
    });

    // If logged in, update User document (XP and streak increment)
    let userXp = 0;
    let userStreak = 0;
    const targetUserId = userId || roadmap.userId || "demo-user-id";

    if (targetUserId) {
      const user = await UserModel.findById(targetUserId);
      if (user) {
        userXp = Math.max(0, (user.xpPoints || 0) + xpDiff);
        
        // Dynamic streak check: if completing a task, verify when they last completed one
        if (xpDiff > 0) {
          const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
          const today = new Date();
          
          if (lastActive) {
            const diffTime = Math.abs(today.getTime() - lastActive.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              // Streak continues
              userStreak = (user.streak || 0) + 1;
            } else if (diffDays > 1) {
              // Streak resets
              userStreak = 1;
            } else {
              userStreak = user.streak || 1;
            }
          } else {
            userStreak = 1;
          }
        } else {
          userStreak = user.streak || 0;
        }

        await UserModel.findByIdAndUpdate(targetUserId, {
          xpPoints: userXp,
          streak: userStreak,
          lastActiveDate: new Date()
        });
      }
    }

    return NextResponse.json({
      success: true,
      roadmap,
      xpPoints: userXp,
      streak: userStreak
    });

  } catch (error: any) {
    console.error("Error updating roadmap task progress:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to update task completion progress"
    }, { status: 500 });
  }
}
