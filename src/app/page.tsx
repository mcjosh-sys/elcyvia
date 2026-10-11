import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Mic,
  Briefcase,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Elcyvia
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your career,{" "}
              <span className="text-primary/80">supercharged by AI</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Create polished resumes, practice interviews with AI, and discover
              job opportunities — all in one platform designed to land you the
              role you deserve.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg">
                  Start for free
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to land your next role
              </h2>
              <p className="mt-4 text-muted-foreground">
                Powerful AI tools that work together to accelerate your job
                search.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<FileText className="size-6" />}
                title="AI Resume Builder"
                description="Create, fix, and tailor resumes with AI. Upload existing resumes or start from scratch with intelligent suggestions."
              />
              <FeatureCard
                icon={<Mic className="size-6" />}
                title="Interview Practice"
                description="Practice with real-time AI interviews tailored to your target role. Get instant feedback and improve your answers."
              />
              <FeatureCard
                icon={<Briefcase className="size-6" />}
                title="Job Discovery"
                description="Browse curated job listings and apply manually or semi-automatically with your optimized resume."
              />
            </div>
          </div>
        </section>

        <section className="border-t py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Advanced AI models help you craft the perfect resume and
                    practice real interview scenarios.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Shield className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Private & Secure</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your data stays private. We never share your resumes or
                    interview data with third parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Zap className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Generate tailored resumes in minutes, not hours. Apply to
                    jobs faster with smart auto-fill.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Elcyvia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
