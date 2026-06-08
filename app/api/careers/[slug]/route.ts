import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";
import CareerModel from "@/lib/db/models/Career";
import { seedCareers } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const connection = await connectToDatabase();

    if (connection.isMock) {
      const db = readMockDb();
      const list = db.careers.length > 0 ? db.careers : seedCareers;
      const career = list.find((c: any) => c.slug === slug);
      
      if (!career) {
        return NextResponse.json({ error: "Career slug not found" }, { status: 404 });
      }
      return NextResponse.json(career);
    }

    // Live MongoDB Query
    const career = await CareerModel.findOne({ slug });
    
    if (!career) {
      return NextResponse.json({ error: "Career pathway not found" }, { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error: any) {
    console.error("Error fetching career detail by slug:", error);
    return NextResponse.json({ 
      error: error.message || "Unable to retrieve career details" 
    }, { status: 500 });
  }
}
