"use client";

import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <DashboardHeader title="Error" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
        <Button onClick={reset} size="sm">
          Try again
        </Button>
      </div>
    </>
  );
}
