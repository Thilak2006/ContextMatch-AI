import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rawText: text("raw_text").notNull(),
  sections: jsonb("sections").notNull().$type<Record<string, string>>(),
  extractedSkills: jsonb("extracted_skills").notNull().$type<string[]>(),
  fileType: text("file_type").default("text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobDescriptions = pgTable("job_descriptions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  rawText: text("raw_text").notNull(),
  extractedSkills: jsonb("extracted_skills").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  jobDescriptionId: integer("job_description_id").references(() => jobDescriptions.id),
  overallScore: text("overall_score").notNull(),
  semanticScore: text("semantic_score").notNull(),
  skillScore: text("skill_score").notNull(),
  experienceScore: text("experience_score").notNull(),
  educationScore: text("education_score").notNull(),
  sectionScores: jsonb("section_scores").notNull().$type<Record<string, number>>(),
  matchedSkills: jsonb("matched_skills").notNull().$type<string[]>(),
  missingSkills: jsonb("missing_skills").notNull().$type<string[]>(),
  additionalSkills: jsonb("additional_skills").notNull().$type<string[]>(),
  strengths: jsonb("strengths").notNull().$type<string[]>(),
  weaknesses: jsonb("weaknesses").notNull().$type<string[]>(),
  suggestions: jsonb("suggestions").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
