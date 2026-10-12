import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { updateResumeSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [resume] = await db
    .select()
    .from(resumes)
    .where(
      and(
        eq(resumes.id, id),
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    );

  if (!resume) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }

  return Response.json(resume);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateResumeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ userId: resumes.userId })
    .from(resumes)
    .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)));

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.content !== undefined) updates.content = parsed.data.content;
  if (parsed.data.templateId !== undefined)
    updates.templateId = parsed.data.templateId;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;

  const [updated] = await db
    .update(resumes)
    .set(updates)
    .where(eq(resumes.id, id))
    .returning();

  return Response.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [existing] = await db
    .select({ userId: resumes.userId })
    .from(resumes)
    .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)));

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: "Resume not found" }, { status: 404 });
  }

  await db
    .update(resumes)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(resumes.id, id));

  return Response.json({ success: true });
}
