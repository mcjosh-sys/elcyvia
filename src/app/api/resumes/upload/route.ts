import { NextRequest } from "next/server";
import { PDFParse } from "pdf-parse";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { RESUME_PARSE_SYSTEM, buildParsePrompt } from "@/lib/ai/prompts";
import { uploadResumeSchema } from "@/lib/validations";
import type { ResumeContent } from "@/types/resume";
import { unauthorized } from "@/lib/api-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const parsed = uploadResumeSchema.safeParse({
    title: formData.get("title"),
    providerId: formData.get("providerId"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return Response.json(
      { error: "Only PDF files are supported" },
      { status: 400 }
    );
  }

  const { title, providerId } = parsed.data;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    const rawText = textResult.text;
    await parser.destroy();

    if (!rawText.trim()) {
      return Response.json(
        {
          error:
            "Could not extract text from PDF. The file may be scanned or image-based.",
        },
        { status: 400 }
      );
    }

    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const content = await provider.generateJSON<ResumeContent>({
      systemPrompt: RESUME_PARSE_SYSTEM,
      prompt: buildParsePrompt(rawText.slice(0, 10000)),
      temperature: 1,
      maxTokens: 4000,
      parse: (text) => JSON.parse(text),
    });

    const [resume] = await db
      .insert(resumes)
      .values({
        userId: session.user.id,
        title: title || "Uploaded Resume",
        content: content as unknown as Record<string, unknown>,
        templateId: "professional",
      })
      .returning();

    return Response.json(resume, { status: 201 });
  } catch (err) {
    console.error("Resume upload/parse failed:", err);
    return Response.json(
      { error: "Failed to parse resume. Please try again." },
      { status: 500 }
    );
  }
}
