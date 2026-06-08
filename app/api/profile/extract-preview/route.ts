import { NextRequest, NextResponse } from "next/server";
import { extractCVData } from "@/lib/parsers/cvExtractor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No CV text content provided" }, { status: 400 });
    }

    const previewData = extractCVData(text);
    return NextResponse.json(previewData);
  } catch (error: any) {
    console.error("Error in profile preview extraction route:", error);
    return NextResponse.json({ 
      error: error.message || "Could not parse preview features" 
    }, { status: 500 });
  }
}
