import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";
import CareerModel from "@/lib/db/models/Career";
import { seedCareers } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry") || "";

    const connection = await connectToDatabase();

    if (connection.isMock) {
      // Mock db queries
      const db = readMockDb();
      let careers = db.careers.length > 0 ? db.careers : seedCareers;

      if (search) {
        const query = search.toLowerCase();
        careers = careers.filter((c: any) => 
          c.title.toLowerCase().includes(query) || 
          c.description.toLowerCase().includes(query) || 
          c.tags.some((t: string) => t.toLowerCase().includes(query))
        );
      }

      if (industry && industry !== "All") {
        careers = careers.filter((c: any) => c.industry.toLowerCase() === industry.toLowerCase() || c.tags.some((t: string) => t.toLowerCase() === industry.toLowerCase()));
      }

      return NextResponse.json(careers);
    }

    // Live MongoDB queries
    let query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    if (industry && industry !== "All") {
      query.$or = [
        { industry: { $regex: industry, $options: "i" } },
        { tags: { $in: [new RegExp(industry, "i")] } }
      ];
    }

    const careers = await CareerModel.find(query);
    return NextResponse.json(careers);

  } catch (error: any) {
    console.error("Error listing careers:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to load career listings" 
    }, { status: 500 });
  }
}
