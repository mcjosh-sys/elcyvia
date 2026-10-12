import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const DEV_AUTH_ENABLED =
  process.env.NODE_ENV === "development" &&
  process.env.DEV_AUTH_BYPASS === "true";

const DEV_USER = {
  email: "dev@elcyvia.local",
  name: "Dev User",
};

export const devCredentialsProvider = Credentials({
  id: "dev-credentials",
  name: "Dev Login",
  credentials: {},
  async authorize() {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, DEV_USER.email));

    if (existing) return existing;

    const [created] = await db
      .insert(users)
      .values({
        email: DEV_USER.email,
        name: DEV_USER.name,
      })
      .returning();

    return created;
  },
});
