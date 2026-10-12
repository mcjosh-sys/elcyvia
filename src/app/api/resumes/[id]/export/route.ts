import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePDFDocument } from "@/lib/resume-templates/pdf-document";
import type { ResumeContent } from "@/types/resume";
import { createEmptyResumeContent } from "@/types/resume";

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

  const content =
    (resume.content as unknown as ResumeContent) || createEmptyResumeContent();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(ResumePDFDocument({ content }) as any);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(resume.title)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF export failed:", err);
    return Response.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
