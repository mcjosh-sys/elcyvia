import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import {
  DEV_AUTH_ENABLED,
  devCredentialsProvider,
} from "./auth/dev-bypass";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  ...(DEV_AUTH_ENABLED ? [devCredentialsProvider] : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: DEV_AUTH_ENABLED ? "jwt" : "database",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, user, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      } else if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
