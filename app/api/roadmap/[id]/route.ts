import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";
import RoadmapModel from "@/lib/db/models/Roadmap";
import { generateMockRoadmap } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (id === "demo-roadmap-id" || !id) {
      // Connect to DB and see if mock database has it
      const connection = await connectToDatabase();
      if (connection.isMock) {
        const db = readMockDb();
        const mockRoadmap = db.roadmaps.find((r: any) => r._id === "demo-roadmap-id");
        if (mockRoadmap) return NextResponse.json(mockRoadmap);
      }
      return NextResponse.json({ _id: "demo-roadmap-id", ...generateMockRoadmap("demo-user-id", "demo-analysis-id") });
    }

    await connectToDatabase();
    const roadmap = await RoadmapModel.findById(id);

    if (!roadmap) {
      return NextResponse.json({ error: "Learning roadmap not found" }, { status: 404 });
    }

    return NextResponse.json(roadmap);
  } catch (error: any) {
    console.error("Error in roadmap GET API:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to load learning roadmap" 
    }, { status: 500 });
  }
}
