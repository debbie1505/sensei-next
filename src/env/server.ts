"use server";
// Server-side environment variables (server-only)
import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error("❌ Invalid server environment variables", _serverEnv.error.issues);
  console.log({
    URL_present: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_present: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_present: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  throw new Error("Invalid server environment variables");
}

console.log("✅ Server environment variables are valid");

export const env = _serverEnv.data;
