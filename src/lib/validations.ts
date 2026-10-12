import { z } from "zod";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  linkedin: z.string().url("Invalid URL").or(z.literal("")).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

const experienceEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  location: z.string().max(200).optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(5000),
});

const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().max(200).optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  gpa: z.string().max(20).optional(),
});

const skillGroupSchema = z.object({
  id: z.string(),
  category: z.string().min(1).max(100),
  items: z.array(z.string().max(100)),
});

const projectEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(3000),
  url: z.string().url().or(z.literal("")).optional(),
  technologies: z.array(z.string().max(100)).optional(),
});

const certificationEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  date: z.string().optional(),
  url: z.string().url().or(z.literal("")).optional(),
});

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().max(3000).optional(),
  experience: z.array(experienceEntrySchema),
  education: z.array(educationEntrySchema),
  skills: z.array(skillGroupSchema),
  projects: z.array(projectEntrySchema),
  certifications: z.array(certificationEntrySchema),
});

const templateIdSchema = z
  .enum(["professional", "modern", "minimal"])
  .optional();

const providerIdSchema = z.enum(["litellm", "gemini"]).optional();

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  templateId: templateIdSchema,
  content: resumeContentSchema.optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: resumeContentSchema.optional(),
  templateId: templateIdSchema,
  status: z.enum(["draft", "complete", "archived"]).optional(),
});

export const generateResumeSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(200),
  jobDescription: z.string().max(10000).optional(),
  personalInfo: personalInfoSchema.optional(),
  providerId: providerIdSchema,
});

export const enhanceSectionSchema = z.object({
  section: z.string().min(1).max(100),
  content: z.union([z.string(), z.array(z.record(z.string(), z.unknown()))]),
  instruction: z.string().max(1000).optional(),
  providerId: providerIdSchema,
});

export const uploadResumeSchema = z.object({
  title: z.string().max(200).optional(),
  providerId: providerIdSchema,
});

export const tailorResumeSchema = z.object({
  jobDescription: z.string().min(10, "Job description is required").max(15000),
  instructions: z.string().max(1000).optional(),
  providerId: providerIdSchema,
});

export const analyzeResumeSchema = z.object({
  jobDescription: z.string().max(15000).optional(),
  providerId: providerIdSchema,
});

export const bulletPointsSchema = z.object({
  description: z.string().min(1).max(5000),
  role: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  providerId: providerIdSchema,
});

export const coverLetterSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  jobDescription: z.string().max(15000).optional(),
  tone: z.enum(["formal", "conversational", "enthusiastic"]).optional(),
  providerId: providerIdSchema,
});

export const completionSchema = z.object({
  currentText: z.string().max(3000),
  fieldType: z.string().min(1).max(50),
  context: z.string().max(2000).optional(),
  providerId: providerIdSchema,
});

export const createInterviewSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(200),
  company: z.string().max(200).optional(),
  resumeId: z.string().uuid().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum([
    "saved",
    "applied",
    "interviewing",
    "offered",
    "rejected",
    "withdrawn",
  ]),
  notes: z.string().max(5000).optional(),
});
