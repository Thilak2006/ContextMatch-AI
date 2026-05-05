/**
 * POST /api/analyze
 * 
 * Analyze a single resume against a job description.
 * Accepts JSON with resume text and job description text.
 * Also supports PDF file upload as FormData.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/analyzer";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let resumeText: string | undefined;
    let resumeFile: Buffer | undefined;
    let resumeFileName: string | undefined;
    let jobDescriptionText: string | undefined;
    let jobTitle: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (file upload)
      const formData = await request.formData();
      jobDescriptionText = formData.get("jobDescription") as string;
      jobTitle = formData.get("jobTitle") as string | undefined;
      resumeText = formData.get("resumeText") as string | undefined;

      const file = formData.get("resumeFile") as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        resumeFile = Buffer.from(arrayBuffer);
        resumeFileName = file.name;
      }
    } else {
      // Handle JSON
      const body = await request.json();
      resumeText = body.resumeText;
      jobDescriptionText = body.jobDescriptionText;
      jobTitle = body.jobTitle;
    }

    if (!jobDescriptionText) {
      return NextResponse.json(
        { success: false, error: "Job description text is required" },
        { status: 400 }
      );
    }

    if (!resumeText && !resumeFile) {
      return NextResponse.json(
        { success: false, error: "Either resume text or a PDF file is required" },
        { status: 400 }
      );
    }

    const result = await analyzeResume({
      resumeText,
      resumeFile,
      resumeFileName,
      jobDescriptionText,
      jobTitle,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        scores: {
          overall: result.scores.overallScore,
          semantic: result.scores.semanticScore,
          skillMatch: result.scores.skillScore,
          experience: result.scores.experienceScore,
          education: result.scores.educationScore,
          summary: result.scores.summaryScore,
          sections: result.scores.sectionScores,
        },
        skills: {
          matched: result.skillComparison.matched,
          missing: result.skillComparison.missing,
          additional: result.skillComparison.additional,
          matchRatio: result.skillComparison.matchScore,
        },
        resumeSkills: result.resumeSkills,
        jobSkills: result.jobSkills,
        resumeSections: result.resumeSections,
        explanation: result.explanation,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
