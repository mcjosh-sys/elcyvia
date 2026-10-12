"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2 } from "lucide-react";
import type { ResumeContent } from "@/types/resume";

interface AIGenerateDialogProps {
  onGenerated: (content: ResumeContent) => void;
  children?: React.ReactNode;
}

export function AIGenerateDialog({
  onGenerated,
  children,
}: AIGenerateDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamedText, setStreamedText] = useState("");

  async function handleGenerate() {
    if (!jobTitle.trim()) return;

    setIsGenerating(true);
    setProgress(10);
    setStreamedText("");

    try {
      const res = await fetch("/api/resumes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText(fullText);
        setProgress(Math.min(90, 10 + (fullText.length / 2000) * 80));
      }

      setProgress(95);

      const cleaned = fullText.replace(/^```(?:json)?\n?|```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as ResumeContent;

      setProgress(100);
      onGenerated(parsed);
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error("Generation failed:", err);
      setStreamedText(
        `Error: ${err instanceof Error ? err.message : "Generation failed. Please try again."}`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function resetForm() {
    setJobTitle("");
    setJobDescription("");
    setProgress(0);
    setStreamedText("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isGenerating) {
          setOpen(o);
          if (!o) resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          children ? (
            <span />
          ) : (
            <Button variant="outline">
              <Sparkles className="size-4" />
              Generate with AI
            </Button>
          )
        }
      >
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate resume with AI</DialogTitle>
          <DialogDescription>
            Describe your target role and we&apos;ll generate a tailored resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="ai-job-title">Target job title</Label>
            <Input
              id="ai-job-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-job-desc">
              Job description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="ai-job-desc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for a more tailored resume..."
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress < 90
                  ? "Generating your resume..."
                  : "Parsing results..."}
              </p>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !jobTitle.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate resume
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
