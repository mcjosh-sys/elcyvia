"use client";

import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { CertificationEntry } from "@/types/resume";

interface CertificationsFormProps {
  data: CertificationEntry[];
  onChange: (data: CertificationEntry[]) => void;
}

export function CertificationsForm({
  data,
  onChange,
}: CertificationsFormProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(data.length > 0 ? [data[0].id] : [])
  );

  function addEntry() {
    const entry: CertificationEntry = {
      id: nanoid(),
      name: "",
      issuer: "",
    };
    onChange([...data, entry]);
    setExpanded((prev) => new Set(prev).add(entry.id));
  }

  function updateEntry(id: string, updates: Partial<CertificationEntry>) {
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
        <h2 className="text-lg font-semibold">Certifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Professional certifications and licenses.
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
                  {entry.name || "Untitled Certification"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {entry.issuer || "Issuer"}
                  {entry.date && ` · ${entry.date}`}
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
            </button>

            {expanded.has(entry.id) && (
              <CardContent className="border-t pt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Certification name</Label>
                    <Input
                      value={entry.name}
                      onChange={(e) =>
                        updateEntry(entry.id, { name: e.target.value })
                      }
                      placeholder="AWS Solutions Architect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing organization</Label>
                    <Input
                      value={entry.issuer}
                      onChange={(e) =>
                        updateEntry(entry.id, { issuer: e.target.value })
                      }
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date obtained</Label>
                    <Input
                      value={entry.date || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { date: e.target.value })
                      }
                      placeholder="Mar 2024"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Credential URL</Label>
                    <Input
                      value={entry.url || ""}
                      onChange={(e) =>
                        updateEntry(entry.id, { url: e.target.value })
                      }
                      placeholder="https://credential.example.com/verify/..."
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
        Add certification
      </Button>
    </div>
  );
}
