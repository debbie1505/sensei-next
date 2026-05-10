"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      // Check if there's a code in the URL (from email confirmation or magic link)
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      
      if (!code) {
        // No code - check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("user_id", session.user.id)
            .single();
          
          if (profile) {
            router.replace("/dashboard");
          } else {
            router.replace("/onboarding");
          }
        } else {
          router.replace("/login");
        }
        return;
      }

      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error("exchangeCodeForSession error:", error.message);
        router.replace("/login?error=auth");
        return;
      }
      
      // Success - go to onboarding for new users
      router.replace("/onboarding");
    };

    handleCallback();
  }, [router]);

  return <p className="p-6">Finishing sign-in…</p>;
}
