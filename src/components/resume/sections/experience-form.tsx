"use client";

import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "cn";
import { useState } from "react";
import type { ExperienceEntry } from "@/types/resume";
import { AIEnhanceButton } from "../ai-enhance-button";

interface ExperienceFormProps {
  resumeId: string;
  data: ExperienceEntry[];
  onChange: (data: ExperienceEntry[]) => void;
}

export function ExperienceForm({ resumeId, data, onChange }: ExperienceFormProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(data.length > 0 ? [data[0].id] : [])
  );

  function addEntry() {
    const entry: ExperienceEntry = {
      id: nanoid(),
      title: "",
      company: "",
      startDate: "",
      current: false,
      description: "",
    };
    onChange([...data, entry]);
    setExpanded((prev) => new Set(prev).add(entry.id));
  }

  function updateEntry(id: string, updates: Partial<ExperienceEntry>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function removeEntry(id: string) {
    onChange(data.filter((e) => e.id !== id));
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function moveEntry(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data.length) return;
    const next = [...data];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Work Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">
            List your relevant work experience, most recent first.
          </p>
        </div>
        {data.length > 0 && (
          <AIEnhanceButton
            resumeId={resumeId}
            section="experience"
            content={data}
            onAccept={(enhanced) =>
              onChange(enhanced as ExperienceEntry[])
            }
          />
        )}
      </div>

      <div className="space-y-3">
        {data.map((entry, index) => (
          <Card key={entry.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleExpand(entry.id)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                toggleExpand(entry.id)
              }
              className="flex w-full items-center justify-between p-4 text-left cursor-pointer"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {entry.title || "Untitled Position"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {entry.company || "Company"}
                  {entry.startDate &&
                    ` · ${entry.startDate}${entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}`}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveEntry(index, "up");
                    }}
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                )}
                {index < data.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveEntry(index, "down");
                    }}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEntry(entry.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            {expanded.has(entry.id) && (
              <CardContent className="border-t pt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job title</Label>
                    <Input
                      value={entry.title}
                      onChange={(e) =>
                        updateEntry(entry.id, { title: e.target.value })
                      }
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={entry.company}
                      onChange={(e) =>
                        updateEntry(entry.id, { company: e.target.value })
                      }
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={entry.location || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { location: e.target.value })
                      }
                      placeholder="Remote"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start date</Label>
                    <Input
                      value={entry.startDate}
                      onChange={(e) =>
                        updateEntry(entry.id, { startDate: e.target.value })
                      }
                      placeholder="Jan 2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End date</Label>
                    <Input
                      value={entry.endDate || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { endDate: e.target.value })
                      }
                      placeholder="Dec 2024"
                      disabled={entry.current}
                    />
                  </div>
                  <div className="flex items-center gap-2 self-end pb-1">
                    <Switch
                      checked={entry.current}
                      onCheckedChange={(checked) =>
                        updateEntry(entry.id, {
                          current: checked,
                          endDate: checked ? undefined : entry.endDate,
                        })
                      }
                    />
                    <Label className="text-sm font-normal">
                      Currently working here
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={entry.description}
                    onChange={(e) =>
                      updateEntry(entry.id, { description: e.target.value })
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addEntry} className="w-full">
        <Plus className="size-4" />
        Add experience
      </Button>
    </div>
  );
}
