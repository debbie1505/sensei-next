"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

// using env. is more safer as we are doing type checking and validation
//---> env.NEXT_PUBLIC_SUPABASE_URL! is a string, not a string | undefined
//--> env.NEXT_PUBLIC_SUPABASE_ANON_KEY! is a string, not a string | undefined
//--> the file responsible is in the src folder and it is called env.ts(for runtime validation)

export const createClient = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);