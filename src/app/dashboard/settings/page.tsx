import { DashboardHeader } from "@/components/dashboard-header";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Settings coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>
      </div>
    </>
  );
}
