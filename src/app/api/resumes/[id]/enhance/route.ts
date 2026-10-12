import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { enhanceSectionSchema } from "@/lib/validations";
import {
  SECTION_ENHANCE_SYSTEM,
  buildEnhancePrompt,
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
    .select({ userId: resumes.userId })
    .from(resumes)
    .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)));

  if (!resume || resume.userId !== session.user.id) return notFound();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = enhanceSectionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { section, content, instruction, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const stream = await provider.streamText({
      systemPrompt: SECTION_ENHANCE_SYSTEM,
      prompt: buildEnhancePrompt(section, content, instruction),
      temperature: 1,
      maxTokens: 3000,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Section enhancement failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "AI enhancement failed. Please try again." },
      { status: 500 }
    );
  }
}
