import { DashboardHeader } from "@/components/dashboard-header";

export const metadata = {
  title: "Jobs",
};

export default function JobsPage() {
  return (
    <>
      <DashboardHeader title="Jobs" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Job listings coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and apply to jobs with your optimized resume.
          </p>
        </div>
      </div>
    </>
  );
}
