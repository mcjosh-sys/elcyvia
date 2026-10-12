"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIEnhanceButton } from "../ai-enhance-button";

interface SummaryFormProps {
  resumeId: string;
  data: string;
  onChange: (data: string) => void;
}

export function SummaryForm({ resumeId, data, onChange }: SummaryFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Professional Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">
            A brief overview of your experience and career objectives.
          </p>
        </div>
        <AIEnhanceButton
          resumeId={resumeId}
          section="summary"
          content={data}
          onAccept={(enhanced) => onChange(enhanced as string)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications..."
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {data.length} / 3000 characters
        </p>
      </div>
    </div>
  );
}
