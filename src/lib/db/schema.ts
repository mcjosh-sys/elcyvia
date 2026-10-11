import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const tz = { mode: "date", withTimezone: true } as const;

// Auth.js tables

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", tz),
  image: text("image"),
  createdAt: timestamp("created_at", tz).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
});

// Auth.js adapter requires snake_case property names for these columns
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_idx").on(
      t.provider,
      t.providerAccountId
    ),
    index("accounts_user_id_idx").on(t.userId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", tz).notNull(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", tz).notNull(),
  },
  (t) => [
    uniqueIndex("verification_tokens_identifier_token_idx").on(
      t.identifier,
      t.token
    ),
  ]
);

// Resume tables

export const resumeStatusEnum = pgEnum("resume_status", [
  "draft",
  "complete",
  "archived",
]);

export const resumes = pgTable(
  "resumes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: jsonb("content").$type<Record<string, unknown>>(),
    templateId: text("template_id"),
    status: resumeStatusEnum("status").default("draft").notNull(),
    version: integer("version").notNull().default(1),
    deletedAt: timestamp("deleted_at", tz),
    createdAt: timestamp("created_at", tz).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
  },
  (t) => [
    index("resumes_user_id_idx").on(t.userId),
    index("resumes_user_status_idx").on(t.userId, t.status),
  ]
);

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", tz).defaultNow().notNull(),
  },
  (t) => [index("resume_versions_resume_id_idx").on(t.resumeId)]
);

// Interview tables

export const interviewStatusEnum = pgEnum("interview_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const interviews = pgTable(
  "interviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    resumeId: uuid("resume_id").references(() => resumes.id, {
      onDelete: "set null",
    }),
    jobTitle: text("job_title"),
    company: text("company"),
    status: interviewStatusEnum("status").default("scheduled").notNull(),
    transcript: jsonb("transcript").$type<Record<string, unknown>[]>(),
    feedback: jsonb("feedback").$type<Record<string, unknown>>(),
    score: integer("score"),
    durationSeconds: integer("duration_seconds"),
    deletedAt: timestamp("deleted_at", tz),
    createdAt: timestamp("created_at", tz).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
  },
  (t) => [
    index("interviews_user_id_idx").on(t.userId),
    index("interviews_resume_id_idx").on(t.resumeId),
    index("interviews_user_status_idx").on(t.userId, t.status),
  ]
);

// Job tables

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  description: text("description"),
  url: text("url"),
  source: text("source"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  currency: text("currency").default("USD"),
  type: jobTypeEnum("type"),
  isRemote: boolean("is_remote").default(false).notNull(),
  postedAt: timestamp("posted_at", tz),
  createdAt: timestamp("created_at", tz).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
});

export const applicationStatusEnum = pgEnum("application_status", [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "withdrawn",
]);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    resumeId: uuid("resume_id").references(() => resumes.id, {
      onDelete: "set null",
    }),
    status: applicationStatusEnum("status").default("saved").notNull(),
    appliedAt: timestamp("applied_at", tz),
    notes: text("notes"),
    deletedAt: timestamp("deleted_at", tz),
    createdAt: timestamp("created_at", tz).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("applications_user_job_unique").on(t.userId, t.jobId),
    index("applications_user_status_idx").on(t.userId, t.status),
    index("applications_job_id_idx").on(t.jobId),
    index("applications_resume_id_idx").on(t.resumeId),
  ]
);

// Subscription tables

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "cancelled",
  "past_due",
]);

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  currency: text("currency").default("NGN").notNull(),
  interval: text("interval").default("monthly").notNull(),
  features: jsonb("features").$type<string[]>(),
  paystackPlanCode: text("paystack_plan_code"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", tz).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
});

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: "restrict" }),
    status: subscriptionStatusEnum("status").default("inactive").notNull(),
    paystackCustomerId: text("paystack_customer_id"),
    paystackSubscriptionCode: text("paystack_subscription_code"),
    currentPeriodStart: timestamp("current_period_start", tz),
    currentPeriodEnd: timestamp("current_period_end", tz),
    createdAt: timestamp("created_at", tz).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", tz).defaultNow().notNull(),
  },
  (t) => [
    index("subscriptions_user_id_idx").on(t.userId),
    index("subscriptions_plan_id_idx").on(t.planId),
  ]
);
