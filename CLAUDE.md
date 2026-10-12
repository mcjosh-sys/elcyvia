# Elcyvia

AI-powered career SaaS — resume builder, interview prep, and job application platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui (base-nova style)
- **Database:** PostgreSQL on Neon (serverless), Drizzle ORM
- **Auth:** Auth.js v5 (NextAuth) with Google OAuth, Drizzle adapter
- **Payments:** Paystack (not Stripe)
- **AI:** LiteLLM proxy (OpenAI-compatible) with Grok and Claude models
- **Fonts:** Space Grotesk (headings), DM Sans (body), JetBrains Mono (data)

## Design Direction

- **Accent:** Deep emerald (oklch 0.45 0.12 162) — not blue
- **Neutrals:** Warm stone-tinted grays (hue 60-80)
- **Cards:** Double-bezel (outer shell + inner core) with warm shadows in light mode, translucent glass borders in dark mode
- **Motion:** Cinematic hero entrance (600ms blur-dissolve), fluid scroll reveals (450ms), snappy interactions (200ms)
- **CTAs:** Pill-shaped primary buttons with arrow badge

## Git Workflow

- Work on the `dev` branch for the app repo
- Work on `main` for the workspace repo
- Create coherent, meaningful commits as you go — don't batch everything at the end
- **Never add Co-Authored-By or AI attribution lines to commits**
- Before every commit: inspect changes, check staged diff, ensure no secrets are committed
- Agent planning files go in `/elcyvia-workspace/`, never in this repo

## Paystack

- Secret key is sensitive — never expose in client bundles, logs, errors, or commits
- Public key may be used client-side but should come from environment config
- Keys are available via environment variables: `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`
- Use Paystack's official documentation when implementing

## Database

- Connection string: `DATABASE_URL` env var (Neon PostgreSQL)
- Schema: `src/lib/db/schema.ts` — uses Drizzle ORM with timezone-aware timestamps
- All FK columns have indexes; auth tables use specific constraints for Auth.js adapter
- Never expose database credentials in client-side code

## Environment

- `.env.local` contains all secrets (gitignored)
- `.env.example` documents required variables (no values)
- Required env vars: DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET, AUTH_URL, LITELLM_*, GEMINI_API_KEY, PAYSTACK_*

## Skills Verification

Before shipping work in any domain, verify with the relevant skills from `.claude/skills/` and `.agents/skills/`. See `skills-catalog.md` in the workspace root for the full catalog organized by domain. Key verification pairings:

| Work area | Verify with |
|---|---|
| UI pages/components | `emil-design-eng`, `web-design-guidelines`, `design-taste-frontend` |
| Animations | `animate`, `animation-performance`, `improve-animations` |
| Landing page design | `design-taste-frontend`, `high-end-visual-design` |
| Database schema | `database-schema-designer` |
| API routes | `senior-backend` |
| Auth/billing | `saas-scaffolder`, `senior-security` |
| Before deploy | `senior-security`, `senior-devops`, `senior-qa` |
| Edge cases | `break-ui` |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/           # Auth.js route handler
│   ├── api/health/         # Health check endpoint
│   ├── dashboard/          # Protected dashboard (resumes, interviews, jobs, settings)
│   ├── login/              # Login page with Google SSO
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── app-sidebar.tsx     # Dashboard sidebar navigation
│   ├── dashboard-header.tsx
│   ├── hero-animations.tsx # Client-side stagger animations
│   └── scroll-reveal.tsx   # IntersectionObserver scroll reveals
├── lib/
│   ├── db/                 # Drizzle schema + client
│   ├── auth.ts             # Auth.js configuration
│   └── validations.ts      # Zod schemas
├── hooks/
└── middleware.ts            # Route protection
```

## ngrok

Canonical hostname: `intensely-actual-chipmunk.ngrok-free.app`
Use the `playmeld-ngrok` skill when an internet-reachable endpoint is needed.
