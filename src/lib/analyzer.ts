/**
 * Main Analysis Orchestrator
 * 
 * Coordinates the entire resume-job matching pipeline:
 * 1. Text extraction & cleaning
 * 2. Resume segmentation
 * 3. Skill extraction
 * 4. Embedding generation
 * 5. Scoring
 * 6. Explanation generation
 */

import { cleanText, extractTextFromPDF, segmentResume } from "./text-processor";
import { extractSkills, compareSkills } from "./skill-extractor";
import { analyzeMatch, rankResumes, type ScoreBreakdown, type RankedResume } from "./scoring-engine";
import { generateExplanation, type Explanation } from "./explainer";

/**
 * Input types for the analyzer
 */
export interface AnalysisInput {
  resumeText?: string;
  resumeFile?: Buffer;
  resumeFileName?: string;
  jobDescriptionText: string;
  jobTitle?: string;
}

/**
 * Complete analysis result
 */
export interface AnalysisResult {
  success: boolean;
  error?: string;
  resumeText: string;
  jobDescriptionText: string;
  resumeSections: Record<string, string>;
  resumeSkills: string[];
  jobSkills: string[];
  skillComparison: {
    matched: string[];
    missing: string[];
    additional: string[];
    matchScore: number;
  };
  scores: ScoreBreakdown;
  explanation: Explanation;
}

/**
 * Analyze a single resume against a job description
 */
export async function analyzeResume(input: AnalysisInput): Promise<AnalysisResult> {
  try {
    // Step 1: Extract and clean resume text
    let rawResumeText: string;
    if (input.resumeFile) {
      rawResumeText = await extractTextFromPDF(input.resumeFile);
    } else if (input.resumeText) {
      rawResumeText = input.resumeText;
    } else {
      throw new Error("Either resumeText or resumeFile must be provided");
    }

    const resumeText = cleanText(rawResumeText);
    const jobDescriptionText = cleanText(input.jobDescriptionText);

    if (!resumeText || resumeText.length < 10) {
      throw new Error("Resume text is too short or could not be extracted");
    }

    if (!jobDescriptionText || jobDescriptionText.length < 10) {
      throw new Error("Job description text is too short");
    }

    // Step 2: Segment resume into sections
    const resumeSections = segmentResume(rawResumeText);

    // Step 3: Extract skills
    const resumeSkills = extractSkills(resumeText);
    const jobSkills = extractSkills(jobDescriptionText);

    // Step 4: Compare skills
    const skillComparison = compareSkills(resumeSkills, jobSkills);

    // Step 5: Compute scores
    const scores = analyzeMatch(resumeText, jobDescriptionText);

    // Step 6: Generate explanation
    const explanation = generateExplanation(scores);

    return {
      success: true,
      resumeText,
      jobDescriptionText,
      resumeSections,
      resumeSkills,
      jobSkills,
      skillComparison: {
        matched: skillComparison.matched,
        missing: skillComparison.missing,
        additional: skillComparison.additional,
        matchScore: skillComparison.matchScore,
      },
      scores,
      explanation,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: message,
      resumeText: "",
      jobDescriptionText: "",
      resumeSections: {},
      resumeSkills: [],
      jobSkills: [],
      skillComparison: { matched: [], missing: [], additional: [], matchScore: 0 },
      scores: {
        overallScore: 0,
        semanticScore: 0,
        skillScore: 0,
        experienceScore: 0,
        educationScore: 0,
        summaryScore: 0,
        skillComparison: { matched: [], missing: [], additional: [], matchScore: 0, categoryBreakdown: {} },
        sectionScores: { skills: 0, experience: 0, education: 0, summary: 0 },
      },
      explanation: {
        scoreLabel: "Error",
        scoreColor: "text-red-600",
        strengths: [],
        weaknesses: [message],
        suggestions: [],
        keyInsights: [],
      },
    };
  }
}

/**
 * Rank multiple resumes against a single job description
 */
export interface RankInput {
  resumes: Array<{
    text?: string;
    file?: Buffer;
    fileName?: string;
    name: string;
  }>;
  jobDescription: string;
  jobTitle?: string;
}

export interface RankResult {
  success: boolean;
  error?: string;
  rankings: Array<{
    name: string;
    overallScore: number;
    scoreLabel: string;
    matchedSkillsCount: number;
    missingSkillsCount: number;
    scores: ScoreBreakdown;
    explanation: Explanation;
  }>;
}

export async function rankMultipleResumes(input: RankInput): Promise<RankResult> {
  try {
    // Extract text from all resumes
    const resumeTexts: { text: string; name: string }[] = [];

    for (const resume of input.resumes) {
      let text: string;
      if (resume.file) {
        text = await extractTextFromPDF(resume.file);
      } else if (resume.text) {
        text = resume.text;
      } else {
        continue;
      }

      resumeTexts.push({
        text: cleanText(text),
        name: resume.name,
      });
    }

    if (resumeTexts.length === 0) {
      throw new Error("No valid resumes provided");
    }

    // Rank resumes
    const ranked = rankResumes(resumeTexts, cleanText(input.jobDescription));

    const rankings = ranked.map((r) => {
      const explanation = generateExplanation(r.score);
      return {
        name: r.name,
        overallScore: r.score.overallScore,
        scoreLabel: explanation.scoreLabel,
        matchedSkillsCount: r.score.skillComparison.matched.length,
        missingSkillsCount: r.score.skillComparison.missing.length,
        scores: r.score,
        explanation,
      };
    });

    return { success: true, rankings };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message, rankings: [] };
  }
}

// Re-export for convenience
export { analyzeMatch, rankResumes } from "./scoring-engine";
export { generateExplanation } from "./explainer";
