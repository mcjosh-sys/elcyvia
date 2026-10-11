import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" description="Your career hub" />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <QuickActionCard
            href="/dashboard/resumes"
            icon={<FileText className="size-5" />}
            title="Resumes"
            description="Create and manage your resumes"
            action="New resume"
            actionHref="/dashboard/resumes/new"
          />
          <QuickActionCard
            href="/dashboard/interviews"
            icon={<Mic className="size-5" />}
            title="Interviews"
            description="Practice with AI interviews"
            action="Start practice"
            actionHref="/dashboard/interviews/new"
          />
          <QuickActionCard
            href="/dashboard/jobs"
            icon={<Briefcase className="size-5" />}
            title="Jobs"
            description="Browse and track applications"
            action="Find jobs"
            actionHref="/dashboard/jobs"
          />
        </div>
      </div>
    </>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  action,
  actionHref,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  actionHref: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <div className="flex gap-2">
          <Link href={actionHref}>
            <Button size="sm">
              <Plus className="size-4" data-icon="inline-start" />
              {action}
            </Button>
          </Link>
          <Link href={href}>
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
