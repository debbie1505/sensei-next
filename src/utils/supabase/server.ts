import { cookies } from "next/headers";
import "server-only";
import {z} from "zod";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/env";

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // next/headers cookies are immutable in RSC; this is fine in route handlers/actions
        },
        remove(name: string, options: any) {
          // same note as set()
        },
      },
    }
  );
};
