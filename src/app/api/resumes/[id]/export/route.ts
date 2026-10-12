import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePDFDocument } from "@/lib/resume-templates/pdf-document";
import type { ResumeContent } from "@/types/resume";
import { createEmptyResumeContent } from "@/types/resume";
import { isValidUUID, invalidId, unauthorized, notFound } from "@/lib/api-utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const { id } = await params;
  if (!isValidUUID(id)) return invalidId();

  const [resume] = await db
    .select({
      title: resumes.title,
      content: resumes.content,
      templateId: resumes.templateId,
      userId: resumes.userId,
    })
    .from(resumes)
    .where(
      and(
        eq(resumes.id, id),
        eq(resumes.userId, session.user.id),
        isNull(resumes.deletedAt)
      )
    );

  if (!resume) return notFound();

  const content =
    (resume.content as unknown as ResumeContent) || createEmptyResumeContent();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(ResumePDFDocument({ content }) as any);
    const safeTitle = resume.title.replace(/[^\w\s.-]/g, "");

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeTitle)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF export failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
