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
import { StaggerChild } from "@/components/hero-animations";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="flex h-14 w-full max-w-3xl items-center justify-between rounded-full border border-border/50 bg-background/80 px-6 shadow-sm backdrop-blur-xl">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Elcyvia
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/login" />}>
              Get started
              <ArrowRight
                aria-hidden="true"
                className="ml-1 size-3.5 transition-transform group-hover/button:translate-x-0.5"
              />
            </Button>
          </div>
        </nav>
      </header>

      <main id="main" className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <StaggerChild index={0}>
                <h1 className="text-4xl font-bold tracking-tighter text-balance sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Resumes, interviews, and jobs.{" "}
                  <span className="text-primary">One platform.</span>
                </h1>
              </StaggerChild>
              <StaggerChild index={1}>
                <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-muted-foreground">
                  Build tailored resumes with AI, practice realistic interviews,
                  and find roles that match your skills.
                </p>
              </StaggerChild>
              <StaggerChild index={2}>
                <div className="mt-10 flex items-center gap-4">
                  <Button
                    size="lg"
                    render={<Link href="/login" />}
                    className="group/cta"
                  >
                    Start for free
                    <ArrowRight
                      aria-hidden="true"
                      className="ml-1 size-4 transition-transform group-hover/cta:translate-x-0.5"
                    />
                  </Button>
                </div>
              </StaggerChild>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-[4/3] rounded-2xl bg-muted/50 ring-1 ring-border p-1.5">
                <div className="flex h-full items-center justify-center rounded-[calc(1rem-6px)] bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="text-center text-muted-foreground">
                    <FileText
                      aria-hidden="true"
                      className="mx-auto size-12 text-primary/40"
                    />
                    <p className="mt-3 text-sm">Product preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-balance">
                  Everything you need to land your next role
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Powerful AI tools that work together to accelerate your job
                  search.
                </p>
              </div>
            </ScrollReveal>
            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-5">
              <ScrollReveal className="md:col-span-3" delay={0}>
                <FeatureCard
                  icon={<FileText aria-hidden="true" className="size-6" />}
                  title="AI Resume Builder"
                  description="Create, fix, and tailor resumes with AI. Upload existing resumes or start from scratch with intelligent suggestions that match job descriptions."
                />
              </ScrollReveal>
              <ScrollReveal className="md:col-span-2" delay={50}>
                <FeatureCard
                  icon={<Mic aria-hidden="true" className="size-6" />}
                  title="Interview Practice"
                  description="Practice with real-time AI interviews tailored to your target role. Get instant feedback."
                />
              </ScrollReveal>
              <ScrollReveal className="md:col-span-5" delay={100}>
                <div className="rounded-2xl bg-muted/50 p-1.5 ring-1 ring-border">
                  <div className="flex flex-col gap-6 rounded-[calc(1rem-6px)] bg-card p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] md:flex-row md:items-center md:gap-12">
                    <div className="inline-flex self-start rounded-xl bg-primary/10 p-3">
                      <Briefcase
                        aria-hidden="true"
                        className="size-6 text-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold tracking-tight">
                        Job Discovery
                      </h3>
                      <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-muted-foreground">
                        Browse curated job listings and apply manually or
                        semi-automatically. Track your applications from saved to
                        offered — all in one place.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href="/login" />}
                    >
                      Explore jobs
                      <ArrowRight aria-hidden="true" className="ml-1 size-3.5" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-t py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
              <ScrollReveal delay={0}>
                <BenefitItem
                  icon={<Sparkles aria-hidden="true" className="size-5" />}
                  title="AI-Powered"
                  description="Advanced AI models help you craft the perfect resume and practice real interview scenarios."
                />
              </ScrollReveal>
              <ScrollReveal delay={50}>
                <BenefitItem
                  icon={<Shield aria-hidden="true" className="size-5" />}
                  title="Private & Secure"
                  description="Your data stays private. We never share your resumes or interview data with third parties."
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <BenefitItem
                  icon={<Zap aria-hidden="true" className="size-5" />}
                  title="Lightning Fast"
                  description="Generate tailored resumes in minutes, not hours. Apply to jobs faster with smart auto-fill."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Elcyvia. All rights reserved.
          </p>
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
    <div className="h-full rounded-2xl bg-muted/50 p-1.5 ring-1 ring-border transition-colors hover:ring-foreground/15">
      <div className="flex h-full flex-col rounded-[calc(1rem-6px)] bg-card p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
        <div className="mb-5 inline-flex self-start rounded-xl bg-primary/10 p-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-[45ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
