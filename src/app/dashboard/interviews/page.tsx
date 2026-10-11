import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Interview Practice",
};

export default function InterviewsPage() {
  return (
    <>
      <DashboardHeader title="Interview Practice">
        <Link href="/dashboard/interviews/new">
          <Button size="sm">
            <Plus className="size-4" data-icon="inline-start" />
            Start practice
          </Button>
        </Link>
      </DashboardHeader>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No practice sessions yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start an AI-powered interview practice session.
          </p>
          <Link href="/dashboard/interviews/new">
            <Button className="mt-4" size="sm">
              <Plus className="size-4" data-icon="inline-start" />
              Start practice
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
