"use client";

import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { EducationEntry } from "@/types/resume";

interface EducationFormProps {
  data: EducationEntry[];
  onChange: (data: EducationEntry[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(data.length > 0 ? [data[0].id] : [])
  );

  function addEntry() {
    const entry: EducationEntry = {
      id: nanoid(),
      institution: "",
      degree: "",
      startDate: "",
      current: false,
    };
    onChange([...data, entry]);
    setExpanded((prev) => new Set(prev).add(entry.id));
  }

  function updateEntry(id: string, updates: Partial<EducationEntry>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function removeEntry(id: string) {
    onChange(data.filter((e) => e.id !== id));
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
      <div>
        <h2 className="text-lg font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your academic background and qualifications.
        </p>
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
                  {entry.degree || "Degree"}
                  {entry.field && ` in ${entry.field}`}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {entry.institution || "Institution"}
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Institution</Label>
                    <Input
                      value={entry.institution}
                      onChange={(e) =>
                        updateEntry(entry.id, {
                          institution: e.target.value,
                        })
                      }
                      placeholder="Stanford University"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={entry.degree}
                      onChange={(e) =>
                        updateEntry(entry.id, { degree: e.target.value })
                      }
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of study</Label>
                    <Input
                      value={entry.field || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { field: e.target.value })
                      }
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start date</Label>
                    <Input
                      value={entry.startDate}
                      onChange={(e) =>
                        updateEntry(entry.id, { startDate: e.target.value })
                      }
                      placeholder="Sep 2019"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End date</Label>
                    <Input
                      value={entry.endDate || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { endDate: e.target.value })
                      }
                      placeholder="Jun 2023"
                      disabled={entry.current}
                    />
                  </div>
                  <div className="flex items-center gap-2">
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
                      Currently studying
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input
                      value={entry.gpa || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { gpa: e.target.value })
                      }
                      placeholder="3.8 / 4.0"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addEntry} className="w-full">
        <Plus className="size-4" />
        Add education
      </Button>
    </div>
  );
}
