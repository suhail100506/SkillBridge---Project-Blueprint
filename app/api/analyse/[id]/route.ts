import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import AnalysisModel from "@/lib/db/models/Analysis";
import { sampleAnalysis } from "@/lib/utils/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (id === "demo-analysis-id" || !id) {
      return NextResponse.json({ _id: "demo-analysis-id", ...sampleAnalysis });
    }

    await connectToDatabase();
    const analysis = await AnalysisModel.findById(id);

    if (!analysis) {
      return NextResponse.json({ error: "Career analysis record not found" }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error fetching analysis by ID:", error);
    return NextResponse.json({ 
      error: error.message || "Unable to retrieve analysis details" 
    }, { status: 500 });
  }
}
