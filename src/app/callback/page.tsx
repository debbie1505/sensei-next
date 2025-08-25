"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // Handles links for email confirmation, magic links, and recovery
    supabase.auth.exchangeCodeForSession(window.location.href)
      .then(({ error }) => {
        if (error) {
          console.error("exchangeCodeForSession error:", error.message);
          router.replace("/login?error=auth");
          return;
        }
        // decide where to go next (e.g., onboarding for new users)
        router.replace("/onboarding");
      });
  }, [router]);

  return <p className="p-6">Finishing sign-in…</p>;
}
