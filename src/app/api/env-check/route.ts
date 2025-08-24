// src/app/api/env-check/route.ts
import { NextResponse } from "next/server";
import { env } from "@/env/server";

function payload() {
  return {
    URL: env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    ANON: (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").slice(0, 6) || null,
    OPENAI_KEY: env.OPENAI_API_KEY ? "present" : "missing",
    NODE_ENV: env.NODE_ENV,
  };
}

export function GET() {
  return NextResponse.json(payload());
}

export async function POST() {
  return NextResponse.json(payload());
}
