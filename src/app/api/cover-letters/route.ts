import { NextRequest } from "next/server";
import { eq, and, isNull, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coverLetters } from "@/lib/db/schema";
import { parseJSON, unauthorized } from "@/lib/api-utils";
import { z } from "zod";

const createSchema = z.object({
  resumeId: z.string().uuid().optional(),
  jobTitle: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  jobDescription: z.string().max(15000).optional(),
  content: z.string().min(1).max(10000),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const letters = await db
    .select({
      id: coverLetters.id,
      resumeId: coverLetters.resumeId,
      jobTitle: coverLetters.jobTitle,
      company: coverLetters.company,
      createdAt: coverLetters.createdAt,
      updatedAt: coverLetters.updatedAt,
    })
    .from(coverLetters)
    .where(
      and(
        eq(coverLetters.userId, session.user.id),
        isNull(coverLetters.deletedAt)
      )
    )
    .orderBy(desc(coverLetters.updatedAt));

  return Response.json(letters);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [letter] = await db
    .insert(coverLetters)
    .values({ userId: session.user.id, ...parsed.data })
    .returning();

  return Response.json(letter, { status: 201 });
}
