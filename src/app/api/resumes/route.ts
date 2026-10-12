import { NextRequest } from "next/server";
import { eq, and, isNull, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { createResumeSchema } from "@/lib/validations";
import { createEmptyResumeContent } from "@/types/resume";
import { parseJSON, unauthorized } from "@/lib/api-utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const userResumes = await db
    .select({
      id: resumes.id,
      title: resumes.title,
      templateId: resumes.templateId,
      status: resumes.status,
      version: resumes.version,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
    })
    .from(resumes)
    .where(
      and(eq(resumes.userId, session.user.id), isNull(resumes.deletedAt))
    )
    .orderBy(desc(resumes.updatedAt));

  return Response.json(userResumes);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = createResumeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, templateId, content } = parsed.data;

  const [resume] = await db
    .insert(resumes)
    .values({
      userId: session.user.id,
      title,
      templateId: templateId || "professional",
      content: (content || createEmptyResumeContent()) as unknown as Record<
        string,
        unknown
      >,
    })
    .returning();

  return Response.json(resume, { status: 201 });
}
