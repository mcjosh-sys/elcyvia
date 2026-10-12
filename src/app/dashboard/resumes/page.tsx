import { connection } from "next/server";
import { eq, and, isNull, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ResumeList } from "@/components/resume/resume-list";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Resumes",
};

export default async function ResumesPage() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userResumes = await db
    .select({
      id: resumes.id,
      title: resumes.title,
      templateId: resumes.templateId,
      status: resumes.status,
      version: resumes.version,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
    })
    .from(resumes)
    .where(
      and(eq(resumes.userId, session.user.id), isNull(resumes.deletedAt))
    )
    .orderBy(desc(resumes.updatedAt));

  return (
    <>
      <DashboardHeader title="Resumes">
        <Link href="/dashboard/resumes/new">
          <Button size="sm">
            <Plus className="size-4" data-icon="inline-start" />
            New resume
          </Button>
        </Link>
      </DashboardHeader>
      <div className="flex-1 p-6">
        {userResumes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h3 className="text-lg font-medium">No resumes yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first resume to get started.
              </p>
              <Link href="/dashboard/resumes/new">
                <Button className="mt-4" size="sm">
                  <Plus className="size-4" data-icon="inline-start" />
                  Create resume
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ResumeList resumes={userResumes} />
        )}
      </div>
    </>
  );
}
