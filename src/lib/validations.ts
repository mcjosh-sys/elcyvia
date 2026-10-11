import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  templateId: z.string().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  templateId: z.string().optional(),
  status: z.enum(["draft", "complete", "archived"]).optional(),
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
