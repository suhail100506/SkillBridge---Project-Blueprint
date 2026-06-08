import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/parsers/pdfParser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "Missing uploaded file content" }, { status: 400 });
    }

    // Convert file arrayBuffer to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF structure
    const extractedText = await parsePDF(buffer);

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error("Error in upload API handler:", error);
    return NextResponse.json({ 
      error: error.message || "Unable to extract text from file" 
    }, { status: 500 });
  }
}
