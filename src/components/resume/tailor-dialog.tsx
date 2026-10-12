"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Loader2, Check, X, ArrowRight } from "lucide-react";
import type { ResumeContent } from "@/types/resume";

interface TailorDialogProps {
  resumeId: string;
  currentContent: ResumeContent;
  onApply: (tailored: ResumeContent) => void;
}

export function TailorDialog({
  resumeId,
  currentContent,
  onApply,
}: TailorDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tailored, setTailored] = useState<ResumeContent | null>(null);
  const [step, setStep] = useState<"input" | "review">("input");

  async function handleTailor() {
    if (!jobDescription.trim()) return;

    setIsTailoring(true);
    setProgress(10);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/tailor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          instructions: instructions.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Tailoring failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setProgress(Math.min(90, 10 + (fullText.length / 4000) * 80));
      }

      const cleaned = fullText.replace(/^```(?:json)?\n?|```$/g, "").trim();
      const parsed = JSON.parse(cleaned) as ResumeContent;

      setTailored(parsed);
      setStep("review");
      setProgress(100);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Tailoring failed"
      );
    } finally {
      setIsTailoring(false);
    }
  }

  function handleApply() {
    if (tailored) {
      onApply(tailored);
      toast.success("Tailored resume applied");
      handleClose();
    }
  }

  function handleClose() {
    setOpen(false);
    setStep("input");
    setTailored(null);
    setProgress(0);
    setJobDescription("");
    setInstructions("");
  }

  function summarizeDiffs(): string[] {
    if (!tailored) return [];
    const diffs: string[] = [];

    if (tailored.summary !== currentContent.summary) {
      diffs.push("Summary rewritten to target the role");
    }

    const expChanged = tailored.experience.some(
      (e, i) => e.description !== currentContent.experience[i]?.description
    );
    if (expChanged) diffs.push("Experience descriptions updated with relevant keywords");

    const currentSkills = currentContent.skills.flatMap((g) => g.items);
    const tailoredSkills = tailored.skills.flatMap((g) => g.items);
    const newSkills = tailoredSkills.filter((s) => !currentSkills.includes(s));
    if (newSkills.length > 0)
      diffs.push(`${newSkills.length} skills added: ${newSkills.slice(0, 5).join(", ")}`);

    if (diffs.length === 0) diffs.push("Content optimized for the job description");
    return diffs;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isTailoring) o ? setOpen(true) : handleClose();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="text-xs gap-1.5" />
        }
      >
        <Target className="size-3.5" />
        Tailor to Job
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "input" ? "Tailor Resume to Job" : "Review Changes"}
          </DialogTitle>
          <DialogDescription>
            {step === "input"
              ? "Paste the job description to optimize your resume for this role."
              : "Review the changes AI made to your resume."}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tailor-jd">Job description</Label>
              <Textarea
                id="tailor-jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={6}
                className="resize-none"
                disabled={isTailoring}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tailor-inst">
                Additional instructions{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="tailor-inst"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Emphasize leadership experience, downplay the internship..."
                rows={2}
                className="resize-none"
                disabled={isTailoring}
              />
            </div>

            {isTailoring && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Analyzing job requirements and tailoring your resume...
                </p>
              </div>
            )}

            <Button
              onClick={handleTailor}
              disabled={isTailoring || !jobDescription.trim()}
              className="w-full"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Tailoring...
                </>
              ) : (
                <>
                  <Target className="size-4" />
                  Tailor resume
                </>
              )}
            </Button>
          </div>
        )}

        {step === "review" && tailored && (
          <div className="space-y-4 py-2">
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Changes made
                </Label>
                <ul className="space-y-1.5">
                  {summarizeDiffs().map((diff, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                    >
                      <ArrowRight className="size-3.5 shrink-0 mt-0.5 text-primary" />
                      {diff}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("input")}>
                <X className="size-4" />
                Back
              </Button>
              <Button onClick={handleApply}>
                <Check className="size-4" />
                Apply changes
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
