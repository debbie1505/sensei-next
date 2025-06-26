"use client"
import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle between login/signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Inside your component
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let response;
    if (isLogin) {
      response = await supabase.auth.signInWithPassword({ email, password });
    } else {
      response = await supabase.auth.signUp({ email, password });
    }

    if (response.error) {
      console.error("Auth error: ", response.error);
      setError(response.error.message);
    } else {
      console.log("Auth success:", response);
      // 🧠 Here's the key: redirect based on context
      router.push(isLogin ? "/dashboard" : "/onboarding");
    }
  };

  const handlePasswordReset = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password", // Change to your frontend URL
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Password reset email sent.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Log In" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-black py-2 rounded">
          {isLogin ? "Log In" : "Sign Up"}
        </button>
        <button
          type="button"
          className="text-sm text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </button>
        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
        {loading && (
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
