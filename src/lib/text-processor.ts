/**
 * Text Processing Pipeline
 * - Extract text from PDF and raw input
 * - Clean and normalize text
 * - Segment resume into sections
 */

// Dynamic import for PDF parsing to avoid build-time issues
let pdfParseModule: ((buffer: Buffer) => Promise<{ text: string }>) | null = null;

async function getPDFParser(): Promise<(buffer: Buffer) => Promise<{ text: string }>> {
  if (!pdfParseModule) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require("pdf-parse");
      pdfParseModule = mod as (buffer: Buffer) => Promise<{ text: string }>;
    } catch {
      throw new Error("PDF parsing is not available. Please paste resume text directly.");
    }
  }
  return pdfParseModule;
}

// Resume section header patterns
const SECTION_PATTERNS: Record<string, RegExp[]> = {
  summary: [
    /^(?:professional\s+)?summary\s*$/im,
    /^(?:executive\s+)?profile\s*$/im,
    /^(?:about\s+me|objective|career\s+objective)\s*$/im,
    /^overview\s*$/im,
  ],
  experience: [
    /^(?:professional\s+)?experience\s*$/im,
    /^work\s+(?:history|experience)\s*$/im,
    /^(?:employment|career)\s*(?:history|record)?\s*$/im,
    /^(?:relevant\s+)?experience\s*$/im,
    /^internships?\s*$/im,
  ],
  education: [
    /^education\s*$/im,
    /^academic\s+(?:background|history|qualifications)\s*$/im,
    /^qualifications\s*$/im,
    /^degrees?\s*$/im,
  ],
  skills: [
    /^(?:technical\s+)?skills\s*$/im,
    /^(?:core\s+)?competenc(?:ies|y)\s*$/im,
    /^technologies\s*(?:&\s*tools)?\s*$/im,
    /^(?:technical\s+)?proficiencies\s*$/im,
    /^areas?\s+of\s+expertise\s*$/im,
    /^(?:programming|software|language)\s+skills\s*$/im,
    /^tools?\s*(?:&\s*technologies)?\s*$/im,
  ],
  projects: [
    /^projects?\s*$/im,
    /^(?:key|notable|selected)\s+projects?\s*$/im,
    /^(?:personal|academic)\s+projects?\s*$/im,
  ],
  certifications: [
    /^certifications?\s*(?:&\s+licenses?)?\s*$/im,
    /^licenses?\s*$/im,
    /^(?:professional\s+)?certifications?\s*$/im,
    /^credentials?\s*$/im,
  ],
};

/**
 * Extract text from a PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parsePDF = await getPDFParser();
    const data = await parsePDF(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF. Please ensure the file is a valid PDF.");
  }
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
  let cleaned = text;

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, " ");

  // Remove special characters but keep important punctuation
  cleaned = cleaned.replace(/[^\w\s.,;:!?()\-/@#$%&*+=\[\]{}"'|]/g, " ");

  // Normalize Unicode characters
  cleaned = cleaned.replace(/[\u2018\u2019]/g, "'");
  cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');
  cleaned = cleaned.replace(/[\u2013\u2014]/g, "-");
  cleaned = cleaned.replace(/\u2026/g, "...");

  // Remove bullet points and list markers
  cleaned = cleaned.replace(/^[•●○▪▸►→]\s*/gm, "");
  cleaned = cleaned.replace(/^\s*[\-\*]\s+/gm, "");

  // Remove page numbers
  cleaned = cleaned.replace(/^\s*\d+\s*$/gm, "");

  // Remove headers/footers patterns
  cleaned = cleaned.replace(/^page\s+\d+\s*(of\s+\d+)?/gim, "");

  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Tokenize text into words
 */
export function tokenize(text: string): string[] {
  const cleaned = text.toLowerCase();
  // Split on non-alphanumeric characters but keep hyphens and dots within words
  const tokens = cleaned
    .split(/[^a-z0-9.\-#+]+/)
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 0);
  return tokens;
}

/**
 * Remove stop words from token array
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought", "used",
  "this", "that", "these", "those", "i", "me", "my", "myself", "we", "our",
  "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
  "he", "him", "his", "himself", "she", "her", "hers", "herself", "it",
  "its", "itself", "they", "them", "their", "theirs", "themselves", "what",
  "which", "who", "whom", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
  "t", "just", "don", "now", "if", "then", "else", "about", "up", "out",
  "into", "over", "after", "before", "between", "through", "during",
  "while", "also", "etc", "including", "include", "included", "well",
  "using", "used", "based", "ability", "work", "working", "strong",
  "experience", "looking", "join", "seeking", "opportunity", "role",
  "position", "company", "team", "environment", "candidate", "ideal",
  "required", "preferred", "must", "excellent", "good", "great",
  "responsible", "responsibilities", "job", "description", "requirements",
]);

export function removeStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => !STOP_WORDS.has(t) && t.length > 1);
}

/**
 * Segment resume text into sections
 */
export function segmentResume(text: string): Record<string, string> {
  const sections: Record<string, string> = {
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    certifications: "",
    other: "",
  };

  const lines = text.split(/\n/);
  const sectionHeaders: { name: string; lineIndex: number }[] = [];

  // Find all section headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 2) continue;

    for (const [sectionName, patterns] of Object.entries(SECTION_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          sectionHeaders.push({ name: sectionName, lineIndex: i });
          break;
        }
      }
    }
  }

  // If no sections found, put everything in appropriate buckets
  if (sectionHeaders.length === 0) {
    // Try heuristic: first few lines are summary, then rest is experience
    const allText = lines.join("\n");
    sections.summary = allText.substring(0, Math.min(500, allText.length));
    sections.experience = allText;
    sections.skills = allText;
    sections.education = allText;
    return sections;
  }

  // Extract content for each section
  for (let i = 0; i < sectionHeaders.length; i++) {
    const current = sectionHeaders[i];
    const next = sectionHeaders[i + 1];
    const startLine = current.lineIndex + 1;
    const endLine = next ? next.lineIndex : lines.length;
    const content = lines.slice(startLine, endLine).join("\n").trim();

    if (sections[current.name] !== undefined) {
      sections[current.name] = content;
    } else {
      sections.other += (sections.other ? "\n" : "") + content;
    }
  }

  // Content before first section header goes into summary
  if (sectionHeaders.length > 0 && sectionHeaders[0].lineIndex > 0) {
    sections.summary = lines.slice(0, sectionHeaders[0].lineIndex).join("\n").trim();
  }

  return sections;
}

/**
 * Generate n-grams from tokens
 */
export function generateNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

/**
 * Extract bigrams and trigrams for phrase detection
 */
export function extractPhrases(tokens: string[]): string[] {
  const bigrams = generateNgrams(tokens, 2);
  const trigrams = generateNgrams(tokens, 3);
  return [...bigrams, ...trigrams];
}
