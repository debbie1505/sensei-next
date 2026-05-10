"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { env } from "@/env/client";
import { listMockCredentials, signInWithMockCredentials, isMockAuthEnabled } from "@/utils/mock/auth";
import {
  getPricingPlanLabel,
  isPricingPlanId,
  PRICING_SELECTION_KEY,
} from "@/utils/pricingSelection";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mockEnabled = isMockAuthEnabled();
  const selectedPlan = useMemo(() => {
    const planParam = searchParams.get("plan");
    if (isPricingPlanId(planParam)) return planParam;
    return null;
  }, [searchParams]);

  useEffect(() => {
    if (!selectedPlan || typeof window === "undefined") return;
    window.localStorage.setItem(PRICING_SELECTION_KEY, selectedPlan);
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const SITE_URL =
      env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    
      try {
        console.log("Attempting auth with:", { isLogin, email });

        if (mockEnabled) {
          if (!isLogin) {
            setError("Mock mode uses fixed test accounts. Choose one of the credentials below and log in.");
            return;
          }
          const mockSession = signInWithMockCredentials(email, password);
          if (!mockSession) {
            setError("Invalid mock credentials. Use one of the listed test accounts.");
            return;
          }
          toast.success(`Signed in as ${mockSession.role}`);
          router.push(selectedPlan ? `/dashboard?plan=${selectedPlan}` : "/dashboard");
          return;
        }

        const supabase = createClient();
    
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          console.log("signInWithPassword response:", data);
                  if (error) {
          console.error("signIn error (raw):", error);
          setError(error.message);
          setLoading(false);
          return;
        }
          toast.success("Logged in!");
          router.push(selectedPlan ? `/dashboard?plan=${selectedPlan}` : "/dashboard");
          return;
        }
    
        // SIGN UP
        const resp = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${SITE_URL}/callback` },
        });
    
        console.log("signUp response:", JSON.stringify(resp, null, 2));
    
        if (resp.error) {
          // Show *actual* fields from Supabase Auth error: name/message/status
          console.error("signUp error (raw):", resp.error);
          setError(resp.error.message || "Sign-up failed");
          setLoading(false);
          return;
        }
    
        // Email confirmations ON (recommended): user exists, session is null
        if (resp.data.user && !resp.data.session) {
          toast.success("Check your email to confirm your account.");
          setLoading(false);
          return; // session will be created on /auth/callback
        }
    
        // Confirmations OFF: session present immediately
        toast.success("Sign-up successful!");
        router.push(selectedPlan ? `/onboarding?plan=${selectedPlan}` : "/onboarding");
      } catch (err) {
        // Print everything so nothing gets swallowed
        console.error("Auth throw (raw):", err);
        try {
          console.error("Auth throw (json):", JSON.stringify(err));
        } catch {}
        // Some runtime errors don’t have code/message; fall back to String(err)
        const message =
          (err as any)?.message ||
          (err as any)?.error?.message ||
          String(err) ||
          "Authentication failed";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    const supabase = createClient();
    const SITE_URL =
      env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/update-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {mockEnabled ? "Mock Login" : isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        {selectedPlan && (
          <p className="mb-4 text-xs font-medium text-center text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            Selected plan: {getPricingPlanLabel(selectedPlan)}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <button type="button" onClick={handlePasswordReset} className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </button>
          <div className="text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">
                  Log In
                </button>
              </>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {mockEnabled && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Mock Auth Test Accounts</p>
            <div className="space-y-2">
              {listMockCredentials().map((credential) => (
                <button
                  key={credential.role}
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setEmail(credential.username);
                    setPassword(credential.password);
                  }}
                  className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded px-3 py-2"
                >
                  <span className="font-semibold capitalize">{credential.role.replace("_", " ")}</span>
                  <div className="text-gray-600">{credential.username} / {credential.password}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
