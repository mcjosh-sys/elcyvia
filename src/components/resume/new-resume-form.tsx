"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Sparkles,
  Upload,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { RESUME_TEMPLATES, type ResumeTemplate, type ResumeContent } from "@/types/resume";
import { AIGenerateDialog } from "./ai-generate-dialog";
import { cn } from "cn";

type CreationPath = "blank" | "ai" | "upload";

interface CreationOption {
  id: CreationPath;
  title: string;
  description: string;
  icon: typeof FileText;
  badge?: string;
  disabled?: boolean;
}

const CREATION_PATHS: CreationOption[] = [
  {
    id: "blank" as const,
    title: "Start from scratch",
    description: "Build your resume section by section",
    icon: FileText,
  },
  {
    id: "ai" as const,
    title: "Generate with AI",
    description: "Let AI create a resume for your target role",
    icon: Sparkles,
  },
  {
    id: "upload" as const,
    title: "Upload existing",
    description: "Import and enhance an existing PDF resume",
    icon: Upload,
  },
];

export function NewResumeForm() {
  const router = useRouter();
  const [path, setPath] = useState<CreationPath>("blank");
  const [step, setStep] = useState<"path" | "details">("path");
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("professional");
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  async function createResume(content?: ResumeContent) {
    const resumeTitle = title.trim() || "Untitled Resume";

    setIsCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeTitle,
          templateId,
          content: content || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create resume");
      }

      const resume = await res.json();
      toast.success("Resume created");
      router.push(`/dashboard/resumes/${resume.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create resume"
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("Please enter a resume title");
      return;
    }
    createResume();
  }

  function handleAIGenerated(content: ResumeContent) {
    const name = content.personalInfo?.fullName;
    if (!title.trim() && name) {
      setTitle(`${name}'s Resume`);
    }
    createResume(content);
  }

  async function handleUpload() {
    if (!uploadFile) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", title.trim() || "Uploaded Resume");

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const resume = await res.json();
      toast.success("Resume parsed and created");
      router.push(`/dashboard/resumes/${resume.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload resume"
      );
    } finally {
      setIsUploading(false);
    }
  }

  if (step === "path") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid gap-4">
          {CREATION_PATHS.map((option) => {
            const Icon = option.icon;
            const selected = path === option.id;
            return (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all",
                  option.disabled && "opacity-50 cursor-not-allowed",
                  selected && !option.disabled && "ring-2 ring-primary"
                )}
                onClick={() => !option.disabled && setPath(option.id)}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {option.title}
                      {option.badge && (
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                  {selected && !option.disabled && (
                    <Check className="size-5 text-primary" />
                  )}
                </CardHeader>
              </Card>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setStep("details")} disabled={!path}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (path === "upload") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upload-title">
              Resume title{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="upload-title"
              placeholder="e.g., My Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload PDF</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                uploadFile
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
            >
              {uploadFile ? (
                <div className="space-y-2">
                  <FileText className="size-8 mx-auto text-primary" />
                  <div className="text-sm font-medium">{uploadFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <Upload className="size-8 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PDF files up to 5MB
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadFile(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("path")}>
            Back
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !uploadFile}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Parsing resume...
              </>
            ) : (
              <>
                Upload and parse
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (path === "ai") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Resume title{" "}
              <span className="text-muted-foreground font-normal">
                (optional — auto-filled after generation)
              </span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer at Google"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {RESUME_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={templateId === template.id}
                  onClick={() => setTemplateId(template.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("path")}>
            Back
          </Button>
          <AIGenerateDialog onGenerated={handleAIGenerated} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Resume title</Label>
          <Input
            id="title"
            placeholder="e.g., Software Engineer at Google"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label>Template</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {RESUME_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={templateId === template.id}
                onClick={() => setTemplateId(template.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("path")}>
          Back
        </Button>
        <Button onClick={handleCreate} disabled={isCreating || !title.trim()}>
          {isCreating ? "Creating..." : "Create resume"}
          {!isCreating && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onClick,
}: {
  template: ResumeTemplate;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        selected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-[3/4] bg-muted rounded-md mb-3 flex items-center justify-center">
          <FileText className="size-8 text-muted-foreground/40" />
        </div>
        <div className="text-sm font-medium">{template.name}</div>
        <div className="text-xs text-muted-foreground">
          {template.description}
        </div>
      </CardContent>
    </Card>
  );
}
