/**
 * Skill Extraction Module
 * - Extract and normalize skills from text
 * - Identify matched, missing, and additional skills
 * - Uses structured skill taxonomy for matching
 */

import { buildSkillLookup, SKILL_TAXONOMY, type SkillEntry } from "./skill-taxonomy";
import { tokenize, removeStopWords, extractPhrases, cleanText } from "./text-processor";

// Singleton lookup map for performance
let skillLookupCache: Map<string, SkillEntry> | null = null;

function getSkillLookup(): Map<string, SkillEntry> {
  if (!skillLookupCache) {
    skillLookupCache = buildSkillLookup();
  }
  return skillLookupCache;
}

/**
 * Extract skills from text using the taxonomy
 */
export function extractSkills(text: string): string[] {
  const lookup = getSkillLookup();
  const found = new Map<string, SkillEntry>();

  // Clean and tokenize the text
  const cleaned = cleanText(text);
  const tokens = removeStopWords(tokenize(cleaned));
  const phrases = extractPhrases(tokens);

  // Check all tokens and phrases against the taxonomy
  const candidates = [...tokens, ...phrases];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    const skill = lookup.get(normalized);
    if (skill && !found.has(skill.name)) {
      found.set(skill.name, skill);
    }
  }

  // Also check for multi-word skills by scanning the text directly using word boundaries
  const textLower = cleaned.toLowerCase();
  for (const skill of SKILL_TAXONOMY) {
    const skillLower = skill.name.toLowerCase();
    // Use word boundary regex to avoid substring matches (e.g., "Java" inside "JavaScript")
    const escapedName = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordBoundaryRegex = new RegExp(`(?:^|[^a-z0-9])${escapedName}(?:[^a-z0-9]|$)`, 'i');
    if (wordBoundaryRegex.test(textLower) || textLower.split(/[^a-z0-9+#.\-]/).includes(skillLower)) {
      if (!found.has(skill.name)) {
        found.set(skill.name, skill);
      }
    }
    // Check aliases with word boundaries
    for (const alias of skill.aliases) {
      if (alias.length >= 3) {
        const aliasLower = alias.toLowerCase();
        const escapedAlias = aliasLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const aliasRegex = new RegExp(`(?:^|[^a-z0-9])${escapedAlias}(?:[^a-z0-9]|$)`, 'i');
        if (aliasRegex.test(textLower) || textLower.split(/[^a-z0-9+#.\-]/).includes(aliasLower)) {
          if (!found.has(skill.name)) {
            found.set(skill.name, skill);
          }
          break;
        }
      }
    }
  }

  return Array.from(found.keys());
}

/**
 * Compare skills between resume and job description
 */
export interface SkillComparison {
  matched: string[];
  missing: string[];
  additional: string[];
  matchScore: number;
  categoryBreakdown: Record<string, { matched: number; total: number }>;
}

/**
 * Compare resume skills against job description requirements
 */
export function compareSkills(
  resumeSkills: string[],
  jobSkills: string[]
): SkillComparison {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map((s) => s.toLowerCase()));

  const matched = resumeSkills.filter((s) => jobSet.has(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !resumeSet.has(s.toLowerCase()));
  const additional = resumeSkills.filter((s) => !jobSet.has(s.toLowerCase()));

  const matchScore = jobSkills.length > 0 ? matched.length / jobSkills.length : 0;

  // Category breakdown
  const lookup = getSkillLookup();
  const categoryBreakdown: Record<string, { matched: number; total: number }> = {};

  for (const jobSkill of jobSkills) {
    const skillEntry = lookup.get(jobSkill.toLowerCase());
    const category = skillEntry?.category || "Other";
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { matched: 0, total: 0 };
    }
    categoryBreakdown[category].total++;
    if (resumeSet.has(jobSkill.toLowerCase())) {
      categoryBreakdown[category].matched++;
    }
  }

  return {
    matched,
    missing,
    additional,
    matchScore,
    categoryBreakdown,
  };
}

/**
 * Get skill categories for a list of skills
 */
export function categorizeSkills(skills: string[]): Record<string, string[]> {
  const lookup = getSkillLookup();
  const categories: Record<string, string[]> = {};

  for (const skill of skills) {
    const entry = lookup.get(skill.toLowerCase());
    const category = entry?.category || "Other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(skill);
  }

  return categories;
}

/**
 * Normalize a skill name to its canonical form
 */
export function normalizeSkill(skill: string): string {
  const lookup = getSkillLookup();
  const entry = lookup.get(skill.toLowerCase());
  return entry?.name || skill;
}
