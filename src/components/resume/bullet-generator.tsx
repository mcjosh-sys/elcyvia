"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check, RotateCcw } from "lucide-react";

interface BulletGeneratorProps {
  resumeId: string;
  role: string;
  company?: string;
  description: string;
  onApply: (bullets: string) => void;
}

export function BulletGenerator({
  resumeId,
  role,
  company,
  description,
  onApply,
}: BulletGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bullets, setBullets] = useState<string[] | null>(null);

  async function handleGenerate() {
    if (!description.trim()) {
      toast.error("Write a rough description first");
      return;
    }
    if (!role.trim()) {
      toast.error("Enter a job title first");
      return;
    }

    setIsGenerating(true);
    setBullets(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/bullets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          role: role.trim(),
          company: company?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setBullets(data.bullets);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate bullets"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function applyBullet(bullet: string) {
    onApply(bullet);
    setBullets(null);
  }

  function applyAll() {
    if (bullets) {
      onApply(bullets.map((b) => `• ${b}`).join("\n"));
      setBullets(null);
    }
  }

  if (bullets) {
    return (
      <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Generated bullets
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleGenerate}
              title="Regenerate"
            >
              <RotateCcw className="size-3" />
            </Button>
          </div>
        </div>
        <ul className="space-y-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 group">
              <span className="text-xs flex-1 text-foreground leading-relaxed">
                {bullet}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100 shrink-0"
                onClick={() => applyBullet(bullet)}
                title="Use this bullet"
              >
                <Check className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" onClick={applyAll} className="w-full text-xs">
          <Check className="size-3" />
          Use all bullets
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating || !description.trim() || !role.trim()}
      className="text-xs gap-1.5"
    >
      {isGenerating ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="size-3.5" />
          Generate bullets
        </>
      )}
    </Button>
  );
}
