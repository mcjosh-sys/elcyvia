"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Check, X } from "lucide-react";

interface AIEnhanceButtonProps {
  resumeId: string;
  section: string;
  content: unknown;
  onAccept: (enhanced: unknown) => void;
}

export function AIEnhanceButton({
  resumeId,
  section,
  content,
  onAccept,
}: AIEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [enhanced, setEnhanced] = useState<unknown>(null);
  const [instruction, setInstruction] = useState("");
  const [showInstructionInput, setShowInstructionInput] = useState(false);

  async function handleEnhance() {
    setIsEnhancing(true);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          content,
          instruction: instruction.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Enhancement failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const cleaned = fullText.replace(/^```(?:json)?\n?|```$/g, "").trim();
      const parsed = JSON.parse(cleaned);

      setEnhanced(parsed);
      setShowReview(true);
    } catch (err) {
      console.error("Enhancement failed:", err);
    } finally {
      setIsEnhancing(false);
      setShowInstructionInput(false);
      setInstruction("");
    }
  }

  function handleAccept() {
    if (enhanced !== null) {
      onAccept(enhanced);
      setShowReview(false);
      setEnhanced(null);
    }
  }

  function handleReject() {
    setShowReview(false);
    setEnhanced(null);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {showInstructionInput ? (
          <div className="flex-1 flex gap-2">
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Make it more concise, add metrics..."
              rows={1}
              className="resize-none text-sm flex-1"
            />
            <Button
              size="sm"
              onClick={handleEnhance}
              disabled={isEnhancing}
            >
              {isEnhancing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowInstructionInput(false);
                setInstruction("");
              }}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isEnhancing ? undefined : setShowInstructionInput(true)
            }
            disabled={isEnhancing}
            className="text-xs gap-1.5"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Enhance with AI
              </>
            )}
          </Button>
        )}
      </div>

      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Enhancement</DialogTitle>
            <DialogDescription>
              Review the enhanced content. Accept to apply or reject to keep
              the original.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">Enhanced version</Label>
              <pre className="mt-1 rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {JSON.stringify(enhanced, null, 2)}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleReject}>
              <X className="size-4" />
              Reject
            </Button>
            <Button onClick={handleAccept}>
              <Check className="size-4" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
