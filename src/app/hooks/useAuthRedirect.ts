"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase/client";

export default function useAuthRedirect(setUser) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check if onboarding data exists for this user
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        // If user row doesn't exist, they haven't onboarded
        if (error || !data) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        setUser(user);

        if (event === "SIGNED_IN" && user) {
          // Same logic as above on login
          const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id)
            .single();

          if (error || !data) {
            navigate("/onboarding");
          } else {
            navigate("/dashboard");
          }
        }

        if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate, setUser]);
}
