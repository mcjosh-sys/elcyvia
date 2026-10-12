import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { analyzeResumeSchema } from "@/lib/validations";
import { RESUME_ANALYZE_SYSTEM, buildAnalyzePrompt } from "@/lib/ai/prompts";
import type { ResumeAnalysis } from "@/types/resume";
import {
  isValidUUID,
  parseJSON,
  invalidId,
  unauthorized,
  notFound,
} from "@/lib/api-utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { id } = await params;
  if (!isValidUUID(id)) return invalidId();

  const [resume] = await db
    .select({ userId: resumes.userId, content: resumes.content })
    .from(resumes)
    .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)));

  if (!resume || resume.userId !== session.user.id) return notFound();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = analyzeResumeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { jobDescription, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const analysis = await provider.generateJSON<ResumeAnalysis>({
      systemPrompt: RESUME_ANALYZE_SYSTEM,
      prompt: buildAnalyzePrompt(resume.content, jobDescription),
      temperature: 1,
      maxTokens: 4000,
      parse: (text) => JSON.parse(text),
    });

    return Response.json(analysis);
  } catch (err) {
    console.error("Resume analysis failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
