/**
 * Matching and Scoring Engine
 * 
 * Combines multiple signals:
 * - Semantic similarity score
 * - Skill match score
 * - Section-wise similarity
 * - Experience alignment
 * - Education alignment
 * 
 * Uses weighted scoring to produce a final match score.
 */

import { computeSectionSimilarity, computeExperienceAlignment, computeEducationAlignment } from "./embeddings";
import { compareSkills, extractSkills, type SkillComparison } from "./skill-extractor";
import { segmentResume } from "./text-processor";

/**
 * Scoring weights configuration
 */
export interface ScoringWeights {
  semantic: number;
  skills: number;
  experience: number;
  education: number;
  summary: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  semantic: 0.25,
  skills: 0.35,
  experience: 0.20,
  education: 0.10,
  summary: 0.10,
};

/**
 * Detailed scoring breakdown
 */
export interface ScoreBreakdown {
  overallScore: number;
  semanticScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  summaryScore: number;
  skillComparison: SkillComparison;
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    summary: number;
  };
}

/**
 * Analyze a resume against a job description and produce a detailed score
 */
export function analyzeMatch(
  resumeText: string,
  jobDescriptionText: string,
  weights: Partial<ScoringWeights> = {}
): ScoreBreakdown {
  const w = { ...DEFAULT_WEIGHTS, ...weights };

  // Segment resume into sections
  const resumeSections = segmentResume(resumeText);

  // Extract skills
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescriptionText);

  // Compare skills
  const skillComparison = compareSkills(resumeSkills, jobSkills);

  // Compute section-wise similarity
  const sectionSimilarity = computeSectionSimilarity(resumeSections, jobDescriptionText);

  // Compute experience alignment
  const experienceScore = computeExperienceAlignment(
    resumeSections.experience || resumeText,
    jobDescriptionText
  );

  // Compute education alignment
  const educationScore = computeEducationAlignment(
    resumeSections.education || "",
    jobDescriptionText
  );

  // Skill score is the match ratio
  const skillScore = skillComparison.matchScore;

  // Summary score from section similarity
  const summaryScore = sectionSimilarity.summary;

  // Semantic score (overall similarity)
  const semanticScore = sectionSimilarity.overall;

  // Compute weighted overall score
  const overallScore =
    semanticScore * w.semantic +
    skillScore * w.skills +
    experienceScore * w.experience +
    educationScore * w.education +
    summaryScore * w.summary;

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    semanticScore: Math.round(semanticScore * 100) / 100,
    skillScore: Math.round(skillScore * 100) / 100,
    experienceScore: Math.round(experienceScore * 100) / 100,
    educationScore: Math.round(educationScore * 100) / 100,
    summaryScore: Math.round(summaryScore * 100) / 100,
    skillComparison,
    sectionScores: {
      skills: sectionSimilarity.skills,
      experience: sectionSimilarity.experience,
      education: sectionSimilarity.education,
      summary: sectionSimilarity.summary,
    },
  };
}

/**
 * Rank multiple resumes against a job description
 */
export interface RankedResume {
  index: number;
  name: string;
  score: ScoreBreakdown;
}

export function rankResumes(
  resumes: { text: string; name: string }[],
  jobDescription: string,
  weights?: Partial<ScoringWeights>
): RankedResume[] {
  const results = resumes.map((resume, index) => ({
    index,
    name: resume.name,
    score: analyzeMatch(resume.text, jobDescription, weights),
  }));

  // Sort by overall score descending
  results.sort((a, b) => b.score.overallScore - a.score.overallScore);

  return results;
}

/**
 * Get score category label
 */
export function getScoreLabel(score: number): string {
  if (score >= 0.85) return "Excellent Match";
  if (score >= 0.70) return "Strong Match";
  if (score >= 0.55) return "Good Match";
  if (score >= 0.40) return "Partial Match";
  if (score >= 0.25) return "Weak Match";
  return "Poor Match";
}

/**
 * Get score color class for UI
 */
export function getScoreColor(score: number): string {
  if (score >= 0.70) return "text-emerald-600";
  if (score >= 0.50) return "text-amber-600";
  if (score >= 0.30) return "text-orange-600";
  return "text-red-600";
}

/**
 * Get background color for progress bars
 */
export function getScoreBgColor(score: number): string {
  if (score >= 0.70) return "bg-emerald-500";
  if (score >= 0.50) return "bg-amber-500";
  if (score >= 0.30) return "bg-orange-500";
  return "bg-red-500";
}
