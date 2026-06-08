import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, readMockDb } from "@/lib/db/mongoose";
import InternshipModel from "@/lib/db/models/Internship";
import { seedInternships } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const remote = searchParams.get("remote") === "true";
    const paidOnly = searchParams.get("paid") === "true";
    const career = searchParams.get("career") || "All";

    const connection = await connectToDatabase();

    if (connection.isMock) {
      const db = readMockDb();
      let listings = db.internships.length > 0 ? db.internships : seedInternships;

      // Apply filter conditions
      if (remote) {
        listings = listings.filter((l: any) => l.remote === true);
      }
      if (paidOnly) {
        listings = listings.filter((l: any) => l.stipend !== null && l.stipend > 0);
      }
      if (career && career !== "All") {
        listings = listings.filter((l: any) => l.career_path.includes(career));
      }

      return NextResponse.json(listings);
    }

    // Live MongoDB Query
    let query: any = {};
    if (remote) {
      query.remote = true;
    }
    if (paidOnly) {
      query.stipend = { $ne: null, $gt: 0 };
    }
    if (career && career !== "All") {
      query.career_path = { $in: [career] };
    }

    const internships = await InternshipModel.find(query);
    return NextResponse.json(internships);

  } catch (error: any) {
    console.error("Error in internships GET API:", error);
    return NextResponse.json({ error: error.message || "Failed to load internship listings" }, { status: 500 });
  }
}
