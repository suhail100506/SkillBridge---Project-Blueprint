import { NextRequest, NextResponse } from "next/server";
import { seedResources } from "@/lib/utils/seedData";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const platform = searchParams.get("platform") || "All";
    const level = searchParams.get("level") || "All";
    const careerPath = searchParams.get("careerPath") || "All";

    // Connect to DB to check mock/live state
    const connection = await connectToDatabase();
    
    let resources = seedResources;
    if (connection.isMock) {
      const db = readMockDb();
      resources = db.resources && db.resources.length > 0 ? db.resources : seedResources;
    }

    // Apply filter conditions
    if (search) {
      const query = search.toLowerCase();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (platform && platform !== "All") {
      resources = resources.filter(r => r.platform.toLowerCase() === platform.toLowerCase());
    }

    if (level && level !== "All") {
      resources = resources.filter(r => r.tags.some(t => t.toLowerCase() === level.toLowerCase()));
    }

    if (careerPath && careerPath !== "All") {
      resources = resources.filter(r => r.careerPath === careerPath);
    }

    return NextResponse.json(resources);
  } catch (error: any) {
    console.error("Error in resources search API:", error);
    return NextResponse.json({ error: error.message || "Failed to query resources" }, { status: 500 });
  }
}
