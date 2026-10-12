import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { generateResumeSchema } from "@/lib/validations";
import {
  RESUME_GENERATION_SYSTEM,
  buildGenerationPrompt,
} from "@/lib/ai/prompts";
import { parseJSON, unauthorized } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = generateResumeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { jobTitle, jobDescription, personalInfo, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const stream = await provider.streamText({
      systemPrompt: RESUME_GENERATION_SYSTEM,
      prompt: buildGenerationPrompt(jobTitle, jobDescription, personalInfo),
      temperature: 1,
      maxTokens: 4000,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Resume generation failed:", err);
    return Response.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}
