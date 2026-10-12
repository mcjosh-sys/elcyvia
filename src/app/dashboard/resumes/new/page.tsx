import { DashboardHeader } from "@/components/dashboard-header";
import { NewResumeForm } from "@/components/resume/new-resume-form";

export const metadata = {
  title: "New Resume",
};

export default function NewResumePage() {
  return (
    <>
      <DashboardHeader
        title="New Resume"
        description="Choose how you'd like to start"
      />
      <div className="flex-1 p-6">
        <NewResumeForm />
      </div>
    </>
  );
}
