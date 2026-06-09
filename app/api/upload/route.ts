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

    let extractedText = "";

    // Check file type to determine parsing method
    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      extractedText = await parsePDF(buffer);
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload PDF or TXT." }, { status: 400 });
    }

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error("Error in upload API handler:", error);
    return NextResponse.json({ 
      error: error.message || "Unable to extract text from file" 
    }, { status: 500 });
  }
}
