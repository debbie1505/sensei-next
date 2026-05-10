"use client";
import { useState } from "react";
import { addToWaitlist } from "@/utils/supabase/waitlist";
import { ArrowRight, CheckCircle, AlertCircle, Building2, GraduationCap } from "lucide-react";

export default function WaitlistSection() {
  const [schoolEmail, setSchoolEmail] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [activeForm, setActiveForm] = useState<"school" | "student" | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent, formType: "school" | "student") => {
    e.preventDefault();
    const email = formType === "school" ? schoolEmail : studentEmail;
    if (!email.trim()) return;

    setStatus("loading");

    const result = await addToWaitlist(email);

    if (result.success) {
      setStatus("success");
      setMessage(
        formType === "school"
          ? "We'll be in touch about piloting Admitra at your school."
          : "You're on the list. We'll notify you when Admitra launches."
      );
      if (formType === "school") {
        setSchoolEmail("");
      } else {
        setStudentEmail("");
      }
      setActiveForm(null);
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
    <section id="cta" className="py-20 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Students */}
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
            <div className="w-12 h-12 bg-primary-foreground/15 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">For Students</h3>
            <p className="text-primary-foreground/80 mb-6">
              Start your application system and keep every essay, deadline, and feedback thread connected.
            </p>
            {!activeForm || activeForm === "student" ? (
              <form onSubmit={(e) => handleSubmit(e, "student")} className="space-y-4">
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  onFocus={() => setActiveForm("student")}
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-background text-foreground rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !studentEmail.trim()}
                  className="w-full bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" && activeForm === "student" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <button
                onClick={() => setActiveForm("student")}
                className="w-full bg-primary-foreground/20 text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors"
              >
                Get started
              </button>
            )}
          </div>

          {/* For Schools & Counselors */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">For Schools & Counselors</h3>
                <p className="text-muted-foreground mb-6">
              Bring this structured system to your counseling office. Pilot Admitra with students.
            </p>
            {!activeForm || activeForm === "school" ? (
              <form onSubmit={(e) => handleSubmit(e, "school")} className="space-y-4">
                <input
                  type="email"
                  required
                  value={schoolEmail}
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  onFocus={() => setActiveForm("school")}
                  placeholder="Work email"
                  className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !schoolEmail.trim()}
                  className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" && activeForm === "school" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
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
                onClick={() => setActiveForm("school")}
                className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Request a pilot
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
        <p className="text-center text-muted-foreground text-sm mt-8">
          We only use your email to contact you about Admitra. No spam. No resale.
        </p>
      </div>
    </section>
  );
}
