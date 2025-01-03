import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      dbId: string;
    } & DefaultSession["user"];
  }
} 