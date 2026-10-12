import { connection } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { ResumeEditor } from "@/components/resume/resume-editor";
import type { ResumeContent } from "@/types/resume";
import { createEmptyResumeContent } from "@/types/resume";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Resume" };

  const [resume] = await db
    .select({ title: resumes.title })
    .from(resumes)
    .where(
      and(
        eq(resumes.id, id),
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    );

  return { title: resume?.title || "Resume" };
}

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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

  if (!resume) notFound();

  const content = (resume.content as unknown as ResumeContent) || createEmptyResumeContent();

  return (
    <ResumeEditor
      resumeId={resume.id}
      initialTitle={resume.title}
      initialContent={content}
      initialTemplateId={resume.templateId || "professional"}
      initialStatus={resume.status}
    />
  );
}
