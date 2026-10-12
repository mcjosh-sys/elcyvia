"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  BarChart3,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import type { ResumeContent, ResumeSection } from "@/types/resume";
import { PersonalInfoForm } from "./sections/personal-info-form";
import { SummaryForm } from "./sections/summary-form";
import { ExperienceForm } from "./sections/experience-form";
import { EducationForm } from "./sections/education-form";
import { SkillsForm } from "./sections/skills-form";
import { ProjectsForm } from "./sections/projects-form";
import { CertificationsForm } from "./sections/certifications-form";
import { ResumePreview } from "./resume-preview";
import { TailorDialog } from "./tailor-dialog";
import { AnalysisPanel } from "./analysis-panel";
import { CoverLetterDialog } from "./cover-letter-dialog";

const SECTION_NAV = [
  { key: "personalInfo" as const, label: "Personal Info", icon: User },
  { key: "summary" as const, label: "Summary", icon: FileText },
  { key: "experience" as const, label: "Experience", icon: Briefcase },
  { key: "education" as const, label: "Education", icon: GraduationCap },
  { key: "skills" as const, label: "Skills", icon: Wrench },
  { key: "projects" as const, label: "Projects", icon: FolderOpen },
  { key: "certifications" as const, label: "Certifications", icon: Award },
];

type SaveStatus = "saved" | "saving" | "error" | "unsaved";
type MobileTab = "edit" | "ai" | "preview";

interface ResumeEditorProps {
  resumeId: string;
  initialTitle: string;
  initialContent: ResumeContent;
  initialTemplateId: string;
  initialStatus: string;
}

export function ResumeEditor({
  resumeId,
  initialTitle,
  initialContent,
  initialTemplateId,
  initialStatus,
}: ResumeEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [activeSection, setActiveSection] = useState<ResumeSection>("personalInfo");
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const save = useCallback(
    async (data: { title?: string; content?: ResumeContent }) => {
      abortController.current?.abort();
      abortController.current = new AbortController();

      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: abortController.current.signal,
        });
        if (!res.ok) throw new Error("Save failed");
        setSaveStatus("saved");
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setSaveStatus("error");
      }
    },
    [resumeId]
  );

  const debouncedSave = useCallback(
    (data: { title?: string; content?: ResumeContent }) => {
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(data), 1500);
    },
    [save]
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    debouncedSave({ title: newTitle, content });
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Resume exported");
    } catch {
      toast.error("Failed to export resume");
    } finally {
      setIsExporting(false);
    }
  }

  function handleContentChange(newContent: ResumeContent) {
    setContent(newContent);
    debouncedSave({ title, content: newContent });
  }

  function updateSection<K extends keyof ResumeContent>(
    key: K,
    value: ResumeContent[K]
  ) {
    const updated = { ...content, [key]: value };
    handleContentChange(updated);
  }

  const sectionForms = (
    <div className="mx-auto max-w-2xl">
      {activeSection === "personalInfo" && (
        <PersonalInfoForm
          data={content.personalInfo}
          onChange={(data) => updateSection("personalInfo", data)}
        />
      )}
      {activeSection === "summary" && (
        <SummaryForm
          resumeId={resumeId}
          data={content.summary || ""}
          onChange={(data) => updateSection("summary", data)}
        />
      )}
      {activeSection === "experience" && (
        <ExperienceForm
          resumeId={resumeId}
          data={content.experience}
          onChange={(data) => updateSection("experience", data)}
        />
      )}
      {activeSection === "education" && (
        <EducationForm
          data={content.education}
          onChange={(data) => updateSection("education", data)}
        />
      )}
      {activeSection === "skills" && (
        <SkillsForm
          data={content.skills}
          onChange={(data) => updateSection("skills", data)}
        />
      )}
      {activeSection === "projects" && (
        <ProjectsForm
          data={content.projects}
          onChange={(data) => updateSection("projects", data)}
        />
      )}
      {activeSection === "certifications" && (
        <CertificationsForm
          data={content.certifications}
          onChange={(data) => updateSection("certifications", data)}
        />
      )}
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link
          href="/dashboard/resumes"
          aria-label="Back to resumes"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="h-8 max-w-xs border-transparent bg-transparent px-2 text-sm font-medium hover:border-border focus:border-border"
        />
        <div className="ml-auto flex items-center gap-2">
          <SaveIndicator status={saveStatus} />
          <Badge variant="outline" className="capitalize text-xs hidden sm:inline-flex">
            {initialStatus}
          </Badge>

          {/* Desktop-only AI tool buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Separator orientation="vertical" className="h-4" />
            <TailorDialog
              resumeId={resumeId}
              currentContent={content}
              onApply={(tailored) => handleContentChange(tailored)}
            />
            <Button
              variant={showAnalysis ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowAnalysis(!showAnalysis);
                if (!showAnalysis) setShowPreview(false);
              }}
              className="text-xs gap-1.5"
            >
              <BarChart3 className="size-3.5" />
              ATS Score
            </Button>
            <CoverLetterDialog resumeId={resumeId} />
            <Separator orientation="vertical" className="h-4 hidden lg:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowPreview(!showPreview);
                if (!showPreview) setShowAnalysis(false);
              }}
              className="hidden lg:flex text-xs gap-1.5"
            >
              {showPreview ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              {showPreview ? "Hide preview" : "Preview"}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs gap-1.5"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">
              {isExporting ? "Exporting..." : "Export PDF"}
            </span>
          </Button>
        </div>
      </header>

      {/* Mobile top-level tabs */}
      <div className="md:hidden flex border-b shrink-0">
        {([
          { id: "edit" as const, label: "Edit", icon: Pencil },
          { id: "ai" as const, label: "AI Tools", icon: Sparkles },
          { id: "preview" as const, label: "Preview", icon: Eye },
        ]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
                mobileTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop section sidebar */}
        <nav className="hidden md:flex w-56 shrink-0 flex-col border-r bg-muted/30 p-3 gap-1 overflow-y-auto">
          {SECTION_NAV.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile: Edit tab content */}
        <div className={cn(
          "flex flex-1 flex-col min-w-0 overflow-hidden",
          "md:flex",
          mobileTab !== "edit" && "hidden md:flex",
          showPreview && "lg:w-1/2"
        )}>
          {/* Mobile section tabs */}
          <div className="md:hidden flex border-b overflow-x-auto px-2 shrink-0">
            {SECTION_NAV.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors shrink-0",
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto p-6">
            {sectionForms}
          </div>
        </div>

        {/* Mobile: AI Tools tab content */}
        {mobileTab === "ai" && (
          <div className="flex-1 overflow-y-auto p-6 md:hidden">
            <div className="mx-auto max-w-md space-y-4">
              <h2 className="text-lg font-semibold">AI Tools</h2>
              <p className="text-sm text-muted-foreground">
                Use AI to improve your resume and generate supporting documents.
              </p>

              <div className="grid gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-primary" />
                      <CardTitle className="text-sm">Tailor to Job</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Rewrite your resume to match a specific job description
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TailorDialog
                      resumeId={resumeId}
                      currentContent={content}
                      onApply={(tailored) => {
                        handleContentChange(tailored);
                        setMobileTab("edit");
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-primary" />
                      <CardTitle className="text-sm">ATS Score</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Analyze your resume against ATS standards and job keywords
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAnalysis(true);
                        setMobileTab("edit");
                      }}
                      className="text-xs gap-1.5"
                    >
                      <BarChart3 className="size-3.5" />
                      Run analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      <CardTitle className="text-sm">Cover Letter</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Generate a tailored cover letter from your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CoverLetterDialog resumeId={resumeId} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Download className="size-4 text-primary" />
                      <CardTitle className="text-sm">Export PDF</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Download your resume as a PDF file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      disabled={isExporting}
                      className="text-xs gap-1.5"
                    >
                      <Download className="size-3.5" />
                      {isExporting ? "Exporting..." : "Export PDF"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Preview tab content */}
        {mobileTab === "preview" && (
          <div className="flex-1 overflow-y-auto p-6 md:hidden">
            <div className="mx-auto max-w-md">
              <ResumePreview content={content} templateId={initialTemplateId} />
            </div>
          </div>
        )}

        {/* Desktop: Preview panel */}
        {showPreview && !showAnalysis && (
          <div className="hidden lg:block w-1/2 border-l bg-muted/30 overflow-y-auto p-6">
            <div className="max-w-md mx-auto">
              <ResumePreview content={content} templateId={initialTemplateId} />
            </div>
          </div>
        )}

        {/* Desktop: Analysis panel */}
        {showAnalysis && (
          <div className="hidden md:block w-80 lg:w-96 border-l bg-background shrink-0 overflow-hidden">
            <AnalysisPanel
              resumeId={resumeId}
              onNavigateSection={(section) => {
                setActiveSection(section);
                setShowAnalysis(false);
              }}
              onClose={() => setShowAnalysis(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {status === "saved" && (
        <>
          <Check className="size-3.5 text-primary" />
          <span className="hidden sm:inline">Saved</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span className="hidden sm:inline">Saving...</span>
        </>
      )}
      {status === "unsaved" && (
        <>
          <div className="size-2 rounded-full bg-amber-400" />
          <span className="hidden sm:inline">Unsaved</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="size-3.5 text-destructive" />
          <span className="text-destructive hidden sm:inline">Save failed</span>
        </>
      )}
    </div>
  );
}
