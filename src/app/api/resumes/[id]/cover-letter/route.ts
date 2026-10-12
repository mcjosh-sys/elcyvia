import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { coverLetterSchema } from "@/lib/validations";
import {
  COVER_LETTER_SYSTEM,
  buildCoverLetterPrompt,
} from "@/lib/ai/prompts";
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

  const parsed = coverLetterSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { jobTitle, company, jobDescription, tone, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const stream = await provider.streamText({
      systemPrompt: COVER_LETTER_SYSTEM,
      prompt: buildCoverLetterPrompt(
        resume.content,
        jobTitle,
        company,
        jobDescription,
        tone
      ),
      temperature: 1,
      maxTokens: 2000,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Cover letter generation failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "AI cover letter generation failed. Please try again." },
      { status: 500 }
    );
  }
}
