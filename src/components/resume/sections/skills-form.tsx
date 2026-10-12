"use client";

import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { SkillGroup } from "@/types/resume";

interface SkillsFormProps {
  data: SkillGroup[];
  onChange: (data: SkillGroup[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  function addGroup() {
    onChange([...data, { id: nanoid(), category: "", items: [] }]);
  }

  function updateGroup(id: string, updates: Partial<SkillGroup>) {
    onChange(data.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }

  function removeGroup(id: string) {
    onChange(data.filter((g) => g.id !== id));
  }

  function addSkill(groupId: string, skill: string) {
    const group = data.find((g) => g.id === groupId);
    if (!group || group.items.includes(skill)) return;
    updateGroup(groupId, { items: [...group.items, skill] });
  }

  function removeSkill(groupId: string, skill: string) {
    const group = data.find((g) => g.id === groupId);
    if (!group) return;
    updateGroup(groupId, { items: group.items.filter((s) => s !== skill) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Group your skills by category (e.g., Programming Languages, Tools,
          Soft Skills).
        </p>
      </div>

      <div className="space-y-4">
        {data.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={group.category}
                    onChange={(e) =>
                      updateGroup(group.id, { category: e.target.value })
                    }
                    placeholder="Programming Languages"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:text-destructive mt-7"
                  onClick={() => removeGroup(group.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(group.id, skill)}
                        className="ml-0.5 hover:text-destructive transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <SkillInput onAdd={(skill) => addSkill(group.id, skill)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addGroup} className="w-full">
        <Plus className="size-4" />
        Add skill group
      </Button>
    </div>
  );
}

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
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
      placeholder="Type a skill and press Enter"
      className="text-sm"
    />
  );
}
