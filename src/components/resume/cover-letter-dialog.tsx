"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, Copy, Download, Save } from "lucide-react";

interface CoverLetterDialogProps {
  resumeId: string;
}

export function CoverLetterDialog({ resumeId }: CoverLetterDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<string>("formal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [letter, setLetter] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleGenerate() {
    if (!jobTitle.trim() || !company.trim()) return;

    setIsGenerating(true);
    setLetter("");

    try {
      const res = await fetch(`/api/resumes/${resumeId}/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          jobDescription: jobDescription.trim() || undefined,
          tone,
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
        fullText += decoder.decode(value, { stream: true });
        setLetter(fullText);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Generation failed"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!letter) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          jobDescription: jobDescription.trim() || undefined,
          content: letter,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("Cover letter saved");
    } catch {
      toast.error("Failed to save cover letter");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(letter);
    toast.success("Copied to clipboard");
  }

  function handleDownload() {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover Letter - ${company} ${jobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    setOpen(false);
    setLetter("");
    setJobTitle("");
    setCompany("");
    setJobDescription("");
    setTone("formal");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isGenerating) o ? setOpen(true) : handleClose();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="text-xs gap-1.5" />
        }
      >
        <FileText className="size-3.5" />
        Cover Letter
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate Cover Letter</DialogTitle>
          <DialogDescription>
            Create a tailored cover letter from your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!letter ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cl-title">Job title</Label>
                  <Input
                    id="cl-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Software Engineer"
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cl-company">Company</Label>
                  <Input
                    id="cl-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cl-tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => v && setTone(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cl-jd">
                  Job description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="cl-jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description for a more targeted letter..."
                  rows={4}
                  className="resize-none"
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating || !jobTitle.trim() || !company.trim()
                }
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="size-4" />
                    Generate cover letter
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <ScrollArea className="max-h-72">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                  {letter}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="size-3.5" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  <Save className="size-3.5" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLetter("")}
                className="w-full text-xs"
              >
                Generate another
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
