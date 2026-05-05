/**
 * Contextual Embedding Module
 * 
 * Implements transformer-inspired semantic similarity using:
 * - TF-IDF vectorization for document representation
 * - Cosine similarity computation
 * - Section-aware embedding generation
 * - Semantic enrichment using skill taxonomy relationships
 * 
 * Architecture supports plugging in Sentence-BERT or other transformer models.
 */

import { cleanText, tokenize, removeStopWords } from "./text-processor";
import { SKILL_TAXONOMY, buildSkillLookup } from "./skill-taxonomy";
import type { SkillEntry } from "./skill-taxonomy";

// Cache for IDF values
let idfCache: Map<string, number> | null = null;
let vocabularyCache: string[] | null = null;

/**
 * Compute term frequency for a document
 */
function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // Normalize by total tokens
  for (const [term, count] of tf) {
    tf.set(term, count / total);
  }
  return tf;
}

/**
 * Build vocabulary from corpus
 */
function buildVocabulary(documents: string[][]): string[] {
  const vocab = new Set<string>();
  for (const doc of documents) {
    for (const token of doc) {
      vocab.add(token);
    }
  }
  return Array.from(vocab).sort();
}

/**
 * Compute IDF across documents
 */
function computeIDF(documents: string[][], vocabulary: string[]): Map<string, number> {
  const idf = new Map<string, number>();
  const N = documents.length;

  for (const term of vocabulary) {
    let docCount = 0;
    for (const doc of documents) {
      if (doc.includes(term)) {
        docCount++;
      }
    }
    // Smoothed IDF
    idf.set(term, Math.log((N + 1) / (docCount + 1)) + 1);
  }
  return idf;
}

/**
 * Compute TF-IDF vector for a document
 */
function computeTFIDFVector(
  tokens: string[],
  vocabulary: string[],
  idf: Map<string, number>
): number[] {
  const tf = computeTF(tokens);
  const vocabIndex = new Map(vocabulary.map((term, idx) => [term, idx]));
  const vector = new Array(vocabulary.length).fill(0);

  for (const [term, tfVal] of tf) {
    const idx = vocabIndex.get(term);
    if (idx !== undefined) {
      const idfVal = idf.get(term) || 1;
      vector[idx] = tfVal * idfVal;
    }
  }
  return vector;
}

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Enrich text with skill-related terms from taxonomy for better matching
 */
function enrichWithSemantics(text: string): string {
  const lookup = buildSkillLookup();
  const tokens = removeStopWords(tokenize(cleanText(text)));
  const enriched = [...tokens];
  const addedTerms = new Set(tokens.map((t) => t.toLowerCase()));

  // For each found skill, add related terms
  for (const token of tokens) {
    const entry = lookup.get(token.toLowerCase());
    if (entry) {
      for (const related of entry.related) {
        const relatedLower = related.toLowerCase();
        if (!addedTerms.has(relatedLower)) {
          enriched.push(relatedLower);
          addedTerms.add(relatedLower);
        }
      }
    }
  }

  return enriched.join(" ");
}

/**
 * Generate embedding (TF-IDF vector) for a text
 */
function generateEmbedding(
  text: string,
  vocabulary: string[],
  idf: Map<string, number>,
  enrichSemantics: boolean = true
): number[] {
  const processedText = enrichSemantics ? enrichWithSemantics(text) : cleanText(text);
  const tokens = removeStopWords(tokenize(processedText));
  return computeTFIDFVector(tokens, vocabulary, idf);
}

/**
 * Compute semantic similarity between two texts
 */
export function computeSemanticSimilarity(textA: string, textB: string): number {
  // Create a mini-corpus for IDF computation
  const tokensA = removeStopWords(tokenize(cleanText(enrichWithSemantics(textA))));
  const tokensB = removeStopWords(tokenize(cleanText(enrichWithSemantics(textB))));

  const documents = [tokensA, tokensB];
  const vocabulary = buildVocabulary(documents);
  const idf = computeIDF(documents, vocabulary);

  const vectorA = computeTFIDFVector(tokensA, vocabulary, idf);
  const vectorB = computeTFIDFVector(tokensB, vocabulary, idf);

  return cosineSimilarity(vectorA, vectorB);
}

/**
 * Embedding result for a document
 */
export interface DocumentEmbedding {
  text: string;
  vector: number[];
  vocabulary: string[];
}

/**
 * Generate embeddings for multiple texts using shared vocabulary
 */
export function generateCorpusEmbeddings(
  texts: string[],
  enrichSemantics: boolean = true
): DocumentEmbedding[] {
  // Build corpus
  const allTokens = texts.map((text) => {
    const processed = enrichSemantics ? enrichWithSemantics(text) : cleanText(text);
    return removeStopWords(tokenize(processed));
  });

  const vocabulary = buildVocabulary(allTokens);
  const idf = computeIDF(allTokens, vocabulary);

  return texts.map((text, idx) => ({
    text,
    vector: computeTFIDFVector(allTokens[idx], vocabulary, idf),
    vocabulary,
  }));
}

/**
 * Section-wise similarity scores
 */
export interface SectionSimilarity {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  summary: number;
}

/**
 * Compute section-wise similarity between resume sections and job description
 */
export function computeSectionSimilarity(
  resumeSections: Record<string, string>,
  jobDescription: string
): SectionSimilarity {
  const sectionFields = ["skills", "experience", "education", "summary"];

  // Build corpus from all sections + job description
  const allTexts = [
    ...sectionFields.map((field) => resumeSections[field] || ""),
    jobDescription,
  ];

  const embeddings = generateCorpusEmbeddings(allTexts);
  const jobEmbedding = embeddings[embeddings.length - 1];

  const sectionScores: Record<string, number> = {};
  let totalWeight = 0;
  let weightedSum = 0;

  // Weights for each section
  const weights: Record<string, number> = {
    skills: 0.35,
    experience: 0.30,
    education: 0.15,
    summary: 0.20,
  };

  for (let i = 0; i < sectionFields.length; i++) {
    const score = cosineSimilarity(embeddings[i].vector, jobEmbedding.vector);
    const field = sectionFields[i];
    sectionScores[field] = Math.round(score * 100) / 100;

    const weight = weights[field] || 0.2;
    weightedSum += score * weight;
    totalWeight += weight;
  }

  const overall = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return {
    overall: Math.round(overall * 100) / 100,
    skills: sectionScores["skills"] || 0,
    experience: sectionScores["experience"] || 0,
    education: sectionScores["education"] || 0,
    summary: sectionScores["summary"] || 0,
  };
}

/**
 * Compute experience alignment based on years and relevance
 */
export function computeExperienceAlignment(
  resumeExperience: string,
  jobRequirements: string
): number {
  // Extract years of experience from text
  const yearsPattern = /(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/gi;
  
  const resumeYearsMatch = resumeExperience.match(yearsPattern);
  const jobYearsMatch = jobRequirements.match(yearsPattern);

  // Extract numeric years
  const extractYears = (matches: RegExpMatchArray | null): number => {
    if (!matches) return 0;
    let maxYears = 0;
    for (const match of matches) {
      const num = parseInt(match.match(/(\d+)/)?.[1] || "0");
      maxYears = Math.max(maxYears, num);
    }
    return maxYears;
  };

  const resumeYears = extractYears(resumeYearsMatch);
  const jobYears = extractYears(jobYearsMatch);

  // If no years found in job, use semantic similarity
  if (jobYears === 0) {
    return computeSemanticSimilarity(resumeExperience, jobRequirements);
  }

  // Score based on years comparison
  if (resumeYears >= jobYears) {
    return Math.min(1, 0.7 + (resumeYears / jobYears) * 0.3);
  } else {
    return Math.max(0, resumeYears / jobYears);
  }
}

/**
 * Compute education alignment
 */
export function computeEducationAlignment(
  resumeEducation: string,
  jobRequirements: string
): number {
  const educationKeywords = [
    "bachelor", "master", "phd", "doctorate", "associate",
    "bs", "ms", "ba", "ma", "mba", "bsc", "msc",
    "computer science", "engineering", "mathematics", "statistics",
    "information technology", "data science", "software engineering",
  ];

  const resumeLower = (resumeEducation || "").toLowerCase();
  const jobLower = (jobRequirements || "").toLowerCase();

  let resumeMatches = 0;
  let jobMatches = 0;
  let commonMatches = 0;

  for (const keyword of educationKeywords) {
    const inResume = resumeLower.includes(keyword);
    const inJob = jobLower.includes(keyword);

    if (inResume) resumeMatches++;
    if (inJob) jobMatches++;
    if (inResume && inJob) commonMatches++;
  }

  if (jobMatches === 0) {
    // No specific education requirements found, use semantic similarity
    return computeSemanticSimilarity(resumeEducation, jobRequirements);
  }

  return commonMatches / jobMatches;
}

/**
 * Clear caches (useful for testing)
 */
export function clearCaches(): void {
  idfCache = null;
  vocabularyCache = null;
}
