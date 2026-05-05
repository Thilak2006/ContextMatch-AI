import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Resume-Job Matching System",
    version: "1.0.0",
    capabilities: [
      "text-analysis",
      "pdf-extraction",
      "skill-matching",
      "semantic-similarity",
      "resume-ranking",
      "explainability",
    ],
    endpoints: {
      analyze: "POST /api/analyze - Analyze resume against job description",
      rank: "POST /api/rank - Rank multiple resumes",
      health: "GET /api/health - System health check",
    },
  });
}
