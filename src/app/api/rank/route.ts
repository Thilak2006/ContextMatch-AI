/**
 * POST /api/rank
 * 
 * Rank multiple resumes against a single job description.
 * Accepts JSON with an array of resumes and a job description.
 */

import { NextRequest, NextResponse } from "next/server";
import { rankMultipleResumes } from "@/lib/analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { resumes, jobDescription, jobTitle } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { success: false, error: "Job description is required" },
        { status: 400 }
      );
    }

    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one resume is required" },
        { status: 400 }
      );
    }

    const result = await rankMultipleResumes({
      resumes: resumes.map((r: { name: string; text: string }) => ({
        name: r.name || "Unnamed Resume",
        text: r.text,
      })),
      jobDescription,
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
        rankings: result.rankings.map((r) => ({
          name: r.name,
          overallScore: r.overallScore,
          scoreLabel: r.scoreLabel,
          matchedSkillsCount: r.matchedSkillsCount,
          missingSkillsCount: r.missingSkillsCount,
          skills: {
            matched: r.scores.skillComparison.matched,
            missing: r.scores.skillComparison.missing,
          },
          scores: {
            overall: r.scores.overallScore,
            semantic: r.scores.semanticScore,
            skillMatch: r.scores.skillScore,
            experience: r.scores.experienceScore,
            education: r.scores.educationScore,
          },
          strengths: r.explanation.strengths.slice(0, 3),
          weaknesses: r.explanation.weaknesses.slice(0, 3),
        })),
      },
    });
  } catch (error) {
    console.error("Rank error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
