import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { bulletPointsSchema } from "@/lib/validations";
import { BULLET_POINTS_SYSTEM, buildBulletPrompt } from "@/lib/ai/prompts";
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

  const parsed = bulletPointsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { description, role, company, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const bullets = await provider.generateJSON<string[]>({
      systemPrompt: BULLET_POINTS_SYSTEM,
      prompt: buildBulletPrompt(description, role, company),
      temperature: 1,
      maxTokens: 1500,
      parse: (text) => JSON.parse(text),
    });

    return Response.json({ bullets });
  } catch (err) {
    console.error("Bullet generation failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "AI bullet generation failed. Please try again." },
      { status: 500 }
    );
  }
}
