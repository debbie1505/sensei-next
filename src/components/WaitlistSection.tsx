"use client";
import { useState } from "react";
import { addToWaitlist } from "@/utils/supabase/waitlist";
import { ArrowRight, CheckCircle, AlertCircle, Building2, GraduationCap } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"school" | "student" | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    const result = await addToWaitlist(email);

    if (result.success) {
      setStatus("success");
      setMessage(
        userType === "school"
          ? "We'll be in touch about piloting Sensei at your school."
          : "You're on the list. We'll notify you when Sensei launches."
      );
      setEmail("");
      setUserType(null);
    } else {
      setStatus("error");
      if (result.error?.includes("duplicate")) {
        setMessage("That email is already on the list.");
      } else if (result.error?.includes("throttle")) {
        setMessage("Try again in a minute.");
      } else {
        setMessage(result.error || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section id="cta" className="py-20 px-6 bg-white dark:bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Schools & Counselors */}
          <div className="bg-gray-900 dark:bg-white rounded-2xl p-8 text-white dark:text-gray-900">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">For Schools & Counselors</h3>
            <p className="text-gray-300 dark:text-gray-600 mb-6">
              Bring Sensei to your school. We work directly with counseling offices to pilot the platform.
            </p>
            {!userType || userType === "school" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={userType === "school" ? email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setUserType("school");
                  }}
                  onFocus={() => setUserType("school")}
                  placeholder="Work email"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-100 text-gray-900 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim() || userType !== "school"}
                  className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" && userType === "school" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request a pilot
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <button
                onClick={() => setUserType("school")}
                className="w-full bg-white/10 text-white dark:bg-gray-900/10 dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 dark:hover:bg-gray-900/20 transition-colors"
              >
                Request a pilot
              </button>
            )}
          </div>

          {/* For Students */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">For Students</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get access when Sensei launches. We'll notify you when your school or your region is live.
            </p>
            {!userType || userType === "student" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={userType === "student" ? email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setUserType("student");
                  }}
                  onFocus={() => setUserType("student")}
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim() || userType !== "student"}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" && userType === "student" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join the waitlist
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <button
                onClick={() => setUserType("student")}
                className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Join the waitlist
              </button>
            )}
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-8 p-4 rounded-xl flex items-center gap-3 max-w-md mx-auto ${
              status === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        {/* Privacy Note */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          We only use your email to contact you about Sensei. No spam. No resale.
        </p>
      </div>
    </section>
  );
}
