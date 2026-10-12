import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDefaultProvider, getProvider } from "@/lib/ai";
import { completionSchema } from "@/lib/validations";
import {
  WRITING_ASSIST_SYSTEM,
  buildCompletionPrompt,
} from "@/lib/ai/prompts";
import { parseJSON, unauthorized } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const [body, err] = await parseJSON(request);
  if (err) return err;

  const parsed = completionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { currentText, fieldType, context, providerId } = parsed.data;

  try {
    const provider = providerId
      ? getProvider(providerId)
      : getDefaultProvider();

    const completion = await provider.generateText({
      systemPrompt: WRITING_ASSIST_SYSTEM,
      prompt: buildCompletionPrompt(currentText, fieldType, context),
      temperature: 1,
      maxTokens: 200,
    });

    return Response.json({ completion: completion.trim() });
  } catch (err) {
    console.error("Completion failed:", err instanceof Error ? err.message : "Unknown error");
    return Response.json(
      { error: "AI completion failed" },
      { status: 500 }
    );
  }
}
