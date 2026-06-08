import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import AnalysisModel from "@/lib/db/models/Analysis";
import UserModel from "@/lib/db/models/User";
import { analyseProfile } from "@/lib/ai/analyseCV";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await req.json();
    const { inputType, rawText } = body;

    if (!inputType || !rawText) {
      return NextResponse.json({ error: "Missing inputType or rawText content" }, { status: 400 });
    }

    await connectToDatabase();

    // Prepare profile details for analysis
    let profileData: any = {};
    if (inputType === "manual") {
      try {
        profileData = JSON.parse(rawText);
      } catch (e) {
        profileData = {
          currentJobTitle: body.currentJobTitle || "Professional",
          industry: body.industry || "Other",
          yearsExperience: body.yearsExperience || 0,
          education: body.education || "Bachelor's",
          skills: body.skills || ["Communication"],
          location: body.location || "Remote",
          preferredWorkType: body.preferredWorkType || "remote",
          hoursPerWeekForLearning: body.hoursPerWeekForLearning || 8,
          targetSalaryMin: body.targetSalaryMin || 0,
          targetSalaryMax: body.targetSalaryMax || 0
        };
      }
    } else {
      // For CV upload, parse preview inputs
      profileData = {
        currentJobTitle: body.previewJob || "Transitioner",
        industry: "Other",
        yearsExperience: 2,
        education: "Bachelor's",
        skills: body.previewSkills || ["Management", "Excel"],
        location: "Remote",
        preferredWorkType: "remote",
        hoursPerWeekForLearning: 8,
        targetSalaryMin: 400000,
        targetSalaryMax: 1000000
      };
    }

    // Call AI analysis (OpenAI/Anthropic or mock fallback)
    const analysisResult = await analyseProfile(profileData);

    // Save Analysis log to database
    const analysisObj = await AnalysisModel.create({
      userId: userId || null,
      inputType,
      rawInput: rawText,
      extractedSkills: analysisResult.extractedSkills,
      overallScore: analysisResult.overallScore,
      recommendations: analysisResult.recommendations,
      aiSummary: analysisResult.aiSummary,
      shareToken: analysisResult.shareToken
    });

    // If logged in, update the user profile in the background
    if (userId) {
      const skillsUpdate = {
        technical: analysisResult.extractedSkills.strong.concat(analysisResult.extractedSkills.developing),
        soft: analysisResult.extractedSkills.transferable,
        domain: [],
        tools: []
      };
      await UserModel.findByIdAndUpdate(userId, {
        currentJobTitle: profileData.currentJobTitle,
        industry: profileData.industry || "Other",
        yearsExperience: profileData.yearsExperience || 2,
        education: profileData.education || "Bachelor's",
        skills: skillsUpdate,
        location: profileData.location || "Remote",
        preferredWorkType: profileData.preferredWorkType || "remote",
        hoursPerWeekForLearning: profileData.hoursPerWeekForLearning || 8,
        targetSalaryMin: profileData.targetSalaryMin || 400000,
        targetSalaryMax: profileData.targetSalaryMax || 1000000
      });
    }

    return NextResponse.json({
      success: true,
      analysisId: analysisObj._id.toString(),
      ...analysisResult
    });

  } catch (error: any) {
    console.error("Error running career analysis API route:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to run profile analysis"
    }, { status: 500 });
  }
}
