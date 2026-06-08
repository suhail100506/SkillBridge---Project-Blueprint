import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import RoadmapModel from "@/lib/db/models/Roadmap";
import AnalysisModel from "@/lib/db/models/Analysis";
import UserModel from "@/lib/db/models/User";
import { generateRoadmap } from "@/lib/ai/generateRoadmap";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { analysisId, targetCareer, targetCareerSlug, hoursPerWeek } = await req.json();

    if (!targetCareer || !targetCareerSlug) {
      return NextResponse.json({ error: "Missing targetCareer or targetCareerSlug" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch analysis details and user profile contexts
    let analysisDetails: any = {};
    let profileData: any = {};

    if (analysisId && analysisId !== "demo-analysis-id") {
      const dbAnalysis = await AnalysisModel.findById(analysisId);
      if (dbAnalysis) {
        analysisDetails = dbAnalysis;
        profileData = JSON.parse(dbAnalysis.rawInput || "{}");
      }
    } else {
      analysisDetails = { targetCareer, targetCareerSlug };
    }

    // Call AI roadmap generation utility (or mock fallback)
    const generatedPlan = await generateRoadmap({
      userId: userId || "demo-user-id",
      analysisId: analysisId || "demo-analysis-id",
      targetCareer,
      targetCareerSlug,
      hoursPerWeek: hoursPerWeek || 8,
      profileData,
      analysisDetails
    });

    // Save Roadmap to database
    const roadmapObj = await RoadmapModel.create({
      userId: userId || null,
      analysisId: analysisId || null,
      targetCareer: generatedPlan.targetCareer,
      targetCareerSlug: generatedPlan.targetCareerSlug,
      totalDays: 90,
      status: 'active',
      overallProgress: 0,
      currentDay: 1,
      phases: generatedPlan.phases,
      totalXP: generatedPlan.totalXP,
      earnedXP: 0
    });

    return NextResponse.json({
      success: true,
      roadmapId: roadmapObj._id.toString(),
      roadmap: roadmapObj
    });

  } catch (error: any) {
    console.error("Error generating career roadmap API route:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to generate learning plan"
    }, { status: 500 });
  }
}
