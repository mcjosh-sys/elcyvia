"use client";

import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { ProjectEntry } from "@/types/resume";

interface ProjectsFormProps {
  data: ProjectEntry[];
  onChange: (data: ProjectEntry[]) => void;
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(data.length > 0 ? [data[0].id] : [])
  );

  function addEntry() {
    const entry: ProjectEntry = {
      id: nanoid(),
      name: "",
      description: "",
    };
    onChange([...data, entry]);
    setExpanded((prev) => new Set(prev).add(entry.id));
  }

  function updateEntry(id: string, updates: Partial<ProjectEntry>) {
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

  function addTech(id: string, tech: string) {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    const technologies = entry.technologies || [];
    if (technologies.includes(tech)) return;
    updateEntry(id, { technologies: [...technologies, tech] });
  }

  function removeTech(id: string, tech: string) {
    const entry = data.find((e) => e.id === id);
    if (!entry) return;
    updateEntry(id, {
      technologies: (entry.technologies || []).filter((t) => t !== tech),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Showcase personal or professional projects.
        </p>
      </div>

      <div className="space-y-3">
        {data.map((entry, index) => (
          <Card key={entry.id}>
            <button
              onClick={() => toggleExpand(entry.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {entry.name || "Untitled Project"}
                </div>
                {entry.technologies && entry.technologies.length > 0 && (
                  <div className="text-xs text-muted-foreground truncate">
                    {entry.technologies.join(", ")}
                  </div>
                )}
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
            </button>

            {expanded.has(entry.id) && (
              <CardContent className="border-t pt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project name</Label>
                    <Input
                      value={entry.name}
                      onChange={(e) =>
                        updateEntry(entry.id, { name: e.target.value })
                      }
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={entry.url || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { url: e.target.value })
                      }
                      placeholder="https://github.com/user/project"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={entry.description}
                    onChange={(e) =>
                      updateEntry(entry.id, { description: e.target.value })
                    }
                    placeholder="What does this project do? What was your role?"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(entry.technologies || []).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(entry.id, tech)}
                          className="ml-0.5 hover:text-destructive transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <TechInput onAdd={(tech) => addTech(entry.id, tech)} />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addEntry} className="w-full">
        <Plus className="size-4" />
        Add project
      </Button>
    </div>
  );
}

function TechInput({ onAdd }: { onAdd: (tech: string) => void }) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = value.trim().replace(/,$/, "");
      if (trimmed) {
        onAdd(trimmed);
        setValue("");
      }
    }
  }

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type a technology and press Enter"
      className="text-sm"
    />
  );
}
