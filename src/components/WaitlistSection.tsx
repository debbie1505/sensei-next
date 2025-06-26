"use client";

import { useState } from "react";
import { addToWaitlist } from "@/utils/supabase/waitlist";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const result = await addToWaitlist(email);

    if (result.success) {
      setStatus("success");
      setMessage("You're on the waitlist 🎉");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  };

  return (
    <section id="waitlist" className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Join the Waitlist</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          {status === "loading" ? "Joining..." : "Notify Me"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
