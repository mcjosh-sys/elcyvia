import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Resumes",
};

export default function ResumesPage() {
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
      <div className="flex flex-1 items-center justify-center p-6">
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
    </>
  );
}
