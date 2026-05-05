/**
 * Explainability Layer
 * 
 * Generates human-readable insights including:
 * - Strengths (matched skills, strong sections)
 * - Weaknesses (missing skills, low similarity areas)
 * - Suggestions for improving the resume
 */

import type { ScoreBreakdown } from "./scoring-engine";
import { getScoreLabel, getScoreColor } from "./scoring-engine";
import { categorizeSkills } from "./skill-extractor";

/**
 * Analysis explanation result
 */
export interface Explanation {
  scoreLabel: string;
  scoreColor: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keyInsights: string[];
}

/**
 * Generate comprehensive explanation of the match analysis
 */
export function generateExplanation(score: ScoreBreakdown): Explanation {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const keyInsights: string[] = [];

  const { skillComparison, sectionScores, semanticScore, experienceScore, educationScore } = score;
  const { matched, missing, additional, categoryBreakdown } = skillComparison;

  // === STRENGTHS ===

  // Matched skills
  if (matched.length > 0) {
    const categorized = categorizeSkills(matched);
    for (const [category, skills] of Object.entries(categorized)) {
      if (skills.length > 0) {
        strengths.push(
          `Strong ${category.toLowerCase()} alignment: ${skills.join(", ")}`
        );
      }
    }
  }

  // Strong section scores
  if (sectionScores.skills >= 0.6) {
    strengths.push("Skills section shows strong alignment with job requirements");
  }
  if (sectionScores.experience >= 0.6) {
    strengths.push("Experience section demonstrates relevant background");
  }
  if (sectionScores.education >= 0.6) {
    strengths.push("Educational background aligns well with position requirements");
  }
  if (semanticScore >= 0.5) {
    strengths.push("Overall resume content is semantically relevant to the position");
  }
  if (experienceScore >= 0.7) {
    strengths.push("Experience level meets or exceeds requirements");
  }

  // Additional skills that could be beneficial
  if (additional.length > 0) {
    const topAdditional = additional.slice(0, 3);
    strengths.push(
      `Brings additional valuable skills: ${topAdditional.join(", ")}${additional.length > 3 ? ` and ${additional.length - 3} more` : ""}`
    );
  }

  // === WEAKNESSES ===

  // Missing skills
  if (missing.length > 0) {
    const categorizedMissing = categorizeSkills(missing);
    for (const [category, skills] of Object.entries(categorizedMissing)) {
      if (skills.length > 0) {
        weaknesses.push(
          `Missing ${category.toLowerCase()}: ${skills.join(", ")}`
        );
      }
    }
  }

  // Low section scores
  if (sectionScores.skills < 0.4) {
    weaknesses.push("Skills section has limited overlap with job requirements");
  }
  if (sectionScores.experience < 0.4) {
    weaknesses.push("Experience section shows limited relevance to the position");
  }
  if (sectionScores.education < 0.4) {
    weaknesses.push("Educational background may not fully align with requirements");
  }
  if (semanticScore < 0.3) {
    weaknesses.push("Overall resume content shows low semantic similarity with the job");
  }
  if (experienceScore < 0.5) {
    weaknesses.push("Experience level may be below position requirements");
  }

  // Low match ratio
  const matchRatio = matched.length / (matched.length + missing.length);
  if (matchRatio < 0.5 && missing.length > 0) {
    weaknesses.push(
      `Only ${Math.round(matchRatio * 100)}% of required skills are covered`
    );
  }

  // === SUGGESTIONS ===

  // Skill gap suggestions
  if (missing.length > 0) {
    const highPriorityMissing = missing.slice(0, 5);
    suggestions.push(
      `Add the following key skills to your resume if you have them: ${highPriorityMissing.join(", ")}`
    );
  }

  // Section-specific suggestions
  if (sectionScores.skills < 0.5) {
    suggestions.push(
      "Enhance your Skills section with more relevant technical competencies listed in the job description"
    );
  }

  if (sectionScores.experience < 0.5) {
    suggestions.push(
      "Tailor your experience descriptions to highlight projects and responsibilities most relevant to this role"
    );
  }

  if (sectionScores.education < 0.5) {
    suggestions.push(
      "Emphasize relevant coursework, certifications, or academic projects that align with the position"
    );
  }

  if (sectionScores.summary < 0.5) {
    suggestions.push(
      "Update your professional summary to reflect key qualifications mentioned in the job description"
    );
  }

  // General suggestions
  if (semanticScore < 0.4) {
    suggestions.push(
      "Consider restructuring your resume to mirror the language and terminology used in the job description"
    );
  }

  if (additional.length > missing.length && missing.length > 0) {
    suggestions.push(
      "While you have many skills, focus on highlighting the specific ones requested in the job posting"
    );
  }

  suggestions.push(
    "Use keywords from the job description naturally throughout your resume to improve ATS compatibility"
  );

  // === KEY INSIGHTS ===

  const matchPercent = score.overallScore * 100;
  keyInsights.push(
    `Overall match score: ${matchPercent.toFixed(0)}% (${getScoreLabel(score.overallScore)})`
  );

  if (matched.length > 0) {
    keyInsights.push(
      `${matched.length} of ${matched.length + missing.length} required skills matched`
    );
  }

  if (categoryBreakdown) {
    const strongCategories = Object.entries(categoryBreakdown)
      .filter(([, data]) => data.total > 0 && data.matched / data.total >= 0.5)
      .map(([cat]) => cat);

    if (strongCategories.length > 0) {
      keyInsights.push(`Strongest areas: ${strongCategories.join(", ")}`);
    }

    const weakCategories = Object.entries(categoryBreakdown)
      .filter(([, data]) => data.total > 0 && data.matched / data.total < 0.5)
      .map(([cat]) => cat);

    if (weakCategories.length > 0) {
      keyInsights.push(`Areas needing improvement: ${weakCategories.join(", ")}`);
    }
  }

  // Ensure we always have at least something
  if (strengths.length === 0) {
    strengths.push("Resume has been successfully parsed and analyzed");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("No significant weaknesses identified");
  }

  return {
    scoreLabel: getScoreLabel(score.overallScore),
    scoreColor: getScoreColor(score.overallScore),
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 6),
    suggestions: suggestions.slice(0, 6),
    keyInsights: keyInsights.slice(0, 5),
  };
}
