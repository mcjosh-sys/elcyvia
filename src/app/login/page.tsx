import { signIn } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { DEV_AUTH_ENABLED } from "@/lib/auth/dev-bypass";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          Elcyvia
        </Link>
        <div>
          <blockquote className="text-lg leading-relaxed max-w-[40ch]">
            &ldquo;Elcyvia helped me land my dream role in 3 weeks.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm opacity-80">
            Alex Rivera, Product Designer
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-sm animate-fade-in-scale">
          <CardHeader className="text-center">
            <Link
              href="/"
              className="mb-2 text-xl font-bold tracking-tight lg:hidden"
            >
              Elcyvia
            </Link>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <LoginForm
              signInAction={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            />
            {DEV_AUTH_ENABLED && (
              <LoginForm
                label="Dev Login (bypass)"
                variant="outline"
                signInAction={async () => {
                  "use server";
                  await signIn("dev-credentials", {
                    redirectTo: "/dashboard",
                  });
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
