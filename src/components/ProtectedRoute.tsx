"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { getMockSession, isMockAuthEnabled } from "@/utils/mock/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (isMockAuthEnabled()) {
        const mockSession = getMockSession();
        if (!mockSession) {
          router.push("/login");
          return;
        }
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      
      if (!profile) {
        router.push("/onboarding");
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkUser();

    if (isMockAuthEnabled()) {
      const onStorage = () => {
        const session = getMockSession();
        if (!session) router.push("/login");
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isMockAuthEnabled()) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
