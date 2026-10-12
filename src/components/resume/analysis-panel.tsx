"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Loader2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  X,
  Sparkles,
} from "lucide-react";
import type { ResumeAnalysis, ResumeSection } from "@/types/resume";

interface AnalysisPanelProps {
  resumeId: string;
  onNavigateSection: (section: ResumeSection) => void;
  onClose: () => void;
}

const PRIORITY_CONFIG = {
  high: { icon: ArrowUp, color: "text-red-500", label: "High" },
  medium: { icon: ArrowRight, color: "text-amber-500", label: "Medium" },
  low: { icon: ArrowDown, color: "text-blue-500", label: "Low" },
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number): string {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-red-500";
}

export function AnalysisPanel({
  resumeId,
  onNavigateSection,
  onClose,
}: AnalysisPanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  async function handleAnalyze() {
    setIsAnalyzing(true);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Analysis failed"
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  const sectionMap: Record<string, ResumeSection> = {
    summary: "summary",
    experience: "experience",
    education: "education",
    skills: "skills",
    projects: "projects",
    certifications: "certifications",
    "personal info": "personalInfo",
    contact: "personalInfo",
  };

  function navigateToSection(name: string) {
    const key = sectionMap[name.toLowerCase()];
    if (key) onNavigateSection(key);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="size-4" />
          ATS Analysis
        </h3>
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Job Description Input */}
          <div className="space-y-2">
            <Label className="text-xs">
              Job description{" "}
              <span className="text-muted-foreground">(for targeted scoring)</span>
            </Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a job description for keyword matching..."
              rows={3}
              className="resize-none text-xs"
              disabled={isAnalyzing}
            />
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : analysis ? (
                <>
                  <BarChart3 className="size-3.5" />
                  Re-analyze
                </>
              ) : (
                <>
                  <BarChart3 className="size-3.5" />
                  Analyze resume
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {analysis && (
            <>
              {/* Score Gauge */}
              <div className="flex flex-col items-center py-4">
                <div className="relative size-28">
                  <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      strokeWidth="8"
                      className="stroke-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(analysis.overallScore / 100) * 264} 264`}
                      className={scoreBg(analysis.overallScore)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        scoreColor(analysis.overallScore)
                      )}
                    >
                      {analysis.overallScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      / 100
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {analysis.overallScore >= 80
                    ? "Strong resume"
                    : analysis.overallScore >= 60
                      ? "Good, needs improvements"
                      : "Needs significant work"}
                </p>
              </div>

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Strengths
                  </Label>
                  {analysis.strengths.map((s, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-start gap-1.5 text-emerald-600"
                    >
                      <span className="shrink-0 mt-0.5">+</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Keywords */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Keywords
                </Label>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.found.map((k) => (
                    <Badge
                      key={k}
                      variant="default"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {k}
                    </Badge>
                  ))}
                  {analysis.keywords.missing.map((k) => (
                    <Badge
                      key={k}
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {k}
                    </Badge>
                  ))}
                  {analysis.keywords.nice_to_have.map((k) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-primary" />
                    Found
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-destructive" />
                    Missing
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full border" />
                    Nice to have
                  </span>
                </div>
              </div>

              {/* Improvements */}
              {analysis.improvements.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Improvements
                  </Label>
                  {analysis.improvements.map((imp, i) => {
                    const config = PRIORITY_CONFIG[imp.priority];
                    const Icon = config.icon;
                    return (
                      <Card key={i} size="sm">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Icon
                              className={cn(
                                "size-3.5 shrink-0 mt-0.5",
                                config.color
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs">{imp.suggestion}</p>
                              <button
                                onClick={() => navigateToSection(imp.section)}
                                className="text-[10px] text-primary hover:underline mt-1"
                              >
                                Go to {imp.section} →
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Section Scores */}
              {analysis.sections.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Section Scores
                  </Label>
                  {analysis.sections.map((sec) => (
                    <button
                      key={sec.name}
                      onClick={() => navigateToSection(sec.name)}
                      className="w-full text-left"
                    >
                      <Card size="sm" className="hover:border-primary/20 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">
                              {sec.name}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-bold",
                                scoreColor(sec.score)
                              )}
                            >
                              {sec.score}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {sec.feedback}
                          </p>
                        </CardContent>
                      </Card>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
