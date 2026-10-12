"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface Resume {
  id: string;
  title: string;
  templateId: string | null;
  status: "draft" | "complete" | "archived";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  complete: { label: "Complete", variant: "default" },
  archived: { label: "Archived", variant: "outline" },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function ResumeList({ resumes }: { resumes: Resume[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/resumes/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resume");
      toast.success("Resume deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleDuplicate(resume: Resume) {
    try {
      const original = await fetch(`/api/resumes/${resume.id}`).then((r) =>
        r.json()
      );
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${resume.title} (copy)`,
          templateId: resume.templateId,
          content: original.content,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate");
      toast.success("Resume duplicated");
      router.refresh();
    } catch {
      toast.error("Failed to duplicate resume");
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => {
          const statusStyle = STATUS_STYLES[resume.status];
          return (
            <Card key={resume.id} className="group relative hover:shadow-md hover:border-primary/20 transition-all">
              <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/resumes/${resume.id}`}>
                    <CardTitle className="text-base font-medium truncate hover:text-primary transition-colors">
                      {resume.title}
                    </CardTitle>
                  </Link>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity shrink-0"
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/resumes/${resume.id}`)
                      }
                    >
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicate(resume)}
                    >
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteTarget(resume)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/dashboard/resumes/${resume.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="size-8 text-muted-foreground/40" />
                    <div className="text-xs text-muted-foreground capitalize">
                      {resume.templateId || "Professional"} template
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={statusStyle.variant}>
                      {statusStyle.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(resume.updatedAt)}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resume?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently deleted.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
