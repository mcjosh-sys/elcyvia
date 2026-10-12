import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { updateResumeSchema } from "@/lib/validations";
import {
  isValidUUID,
  parseJSON,
  invalidId,
  unauthorized,
  notFound,
} from "@/lib/api-utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { id } = await params;
  if (!isValidUUID(id)) return invalidId();

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

  if (!resume) return notFound();

  return Response.json(resume);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { id } = await params;
  if (!isValidUUID(id)) return invalidId();

  const [body, err] = await parseJSON(request);
  if (err) return err;

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

  if (!existing || existing.userId !== session.user.id) return notFound();

  const { title, content, templateId, status } = parsed.data;
  const updates = Object.fromEntries(
    Object.entries({
      title,
      content,
      templateId,
      status,
      updatedAt: new Date(),
    }).filter(([, v]) => v !== undefined)
  );

  const [updated] = await db
    .update(resumes)
    .set(updates)
    .where(eq(resumes.id, id))
    .returning();

  return Response.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { id } = await params;
  if (!isValidUUID(id)) return invalidId();

  const [existing] = await db
    .select({ userId: resumes.userId })
    .from(resumes)
    .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)));

  if (!existing || existing.userId !== session.user.id) return notFound();

  await db
    .update(resumes)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(resumes.id, id));

  return new Response(null, { status: 204 });
}
