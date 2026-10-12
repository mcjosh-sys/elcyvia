"use client";

import { useState, useEffect, type ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResumeContent } from "@/types/resume";

interface ResumePreviewProps {
  content: ResumeContent;
  templateId: string;
}

export function ResumePreview({ content, templateId }: ResumePreviewProps) {
  const [Template, setTemplate] = useState<ComponentType<{
    content: ResumeContent;
  }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    import(`@/lib/resume-templates/${templateId}`)
      .then((mod) => {
        setTemplate(() => mod.Preview);
        setLoading(false);
      })
      .catch(() => {
        import("@/lib/resume-templates/professional").then((mod) => {
          setTemplate(() => mod.Preview);
          setLoading(false);
        });
      });
  }, [templateId]);

  if (loading || !Template) {
    return (
      <div className="aspect-[210/297] bg-white rounded-lg shadow-md p-8">
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-3 w-64 mx-auto mb-6" />
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-3/4 mb-4" />
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    );
  }

  return (
    <div className="aspect-[210/297] bg-white rounded-lg shadow-md overflow-hidden">
      <Template content={content} />
    </div>
  );
}
