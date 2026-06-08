import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";
import RoadmapModel from "@/lib/db/models/Roadmap";
import { generateMockRoadmap } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const connection = await connectToDatabase();
    
    if (connection.isMock || !userId) {
      // Mock db listings
      const db = readMockDb();
      // Ensure the demo roadmap is present
      let userRoadmaps = db.roadmaps.filter((r: any) => r.userId === (userId || "demo-user-id"));
      
      if (userRoadmaps.length === 0) {
        // Fallback to sample generated roadmap
        const sampleRoadmap = {
          _id: "demo-roadmap-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...generateMockRoadmap(userId || "demo-user-id", "demo-analysis-id")
        };
        userRoadmaps = [sampleRoadmap];
      }
      
      return NextResponse.json(userRoadmaps);
    }

    // Live MongoDB Query
    const roadmaps = await RoadmapModel.find({ userId });
    return NextResponse.json(roadmaps);

  } catch (error: any) {
    console.error("Error listing roadmaps:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to retrieve active roadmaps" 
    }, { status: 500 });
  }
}
