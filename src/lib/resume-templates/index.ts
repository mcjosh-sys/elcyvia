import type { ResumeContent } from "@/types/resume";
import type { ComponentType } from "react";

export interface TemplateComponent {
  Preview: ComponentType<{ content: ResumeContent }>;
}

const templates: Record<string, () => Promise<TemplateComponent>> = {
  professional: () => import("./professional"),
  modern: () => import("./modern"),
  minimal: () => import("./minimal"),
};

export async function getTemplate(id: string): Promise<TemplateComponent> {
  const loader = templates[id] || templates.professional;
  return loader();
}

export function getTemplateIds(): string[] {
  return Object.keys(templates);
}
