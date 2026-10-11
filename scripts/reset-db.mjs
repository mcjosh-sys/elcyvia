import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`DROP TABLE IF EXISTS sessions CASCADE`;
await sql`DROP TABLE IF EXISTS accounts CASCADE`;
await sql`DROP TABLE IF EXISTS verification_tokens CASCADE`;
await sql`DROP TABLE IF EXISTS subscriptions CASCADE`;
await sql`DROP TABLE IF EXISTS subscription_plans CASCADE`;
await sql`DROP TABLE IF EXISTS applications CASCADE`;
await sql`DROP TABLE IF EXISTS interviews CASCADE`;
await sql`DROP TABLE IF EXISTS resume_versions CASCADE`;
await sql`DROP TABLE IF EXISTS resumes CASCADE`;
await sql`DROP TABLE IF EXISTS jobs CASCADE`;
await sql`DROP TABLE IF EXISTS users CASCADE`;
console.log("All tables dropped");

await sql`DROP TYPE IF EXISTS resume_status CASCADE`;
await sql`DROP TYPE IF EXISTS interview_status CASCADE`;
await sql`DROP TYPE IF EXISTS job_type CASCADE`;
await sql`DROP TYPE IF EXISTS application_status CASCADE`;
await sql`DROP TYPE IF EXISTS subscription_status CASCADE`;
console.log("All enums dropped");
console.log("Database reset complete");
