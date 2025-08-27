"use client";
import { useState } from "react";
import { addToWaitlist } from "@/utils/supabase/waitlist";
import { Mail, CheckCircle, AlertCircle, ArrowRight, Sparkles, GraduationCap, Calendar, Target } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setStatus("loading");

    const result = await addToWaitlist(email);

    if (result.success) {
      setStatus("success");
      setMessage("Check your email to confirm your spot.");
      setEmail("");
      setGrade("");
      setGraduationYear("");
      setBiggestChallenge("");
    } else {
      setStatus("error");
      if (result.error?.includes("duplicate")) {
        setMessage("That email doesn't look right. Try again.");
      } else if (result.error?.includes("throttle")) {
        setMessage("Try again in ~1 minute.");
      } else {
        setMessage(result.error || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section id="waitlist" className="py-32 px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Enhanced Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight">
            Get early access
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
            Be first to try Sensei. Join the waitlist and get notified when we launch.
          </p>
        </div>

        {/* Enhanced Waitlist Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 max-w-2xl mx-auto shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (required)"
                className="w-full pl-14 pr-5 py-5 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                disabled={status === "loading"}
              />
            </div>

            {/* Grade Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <GraduationCap className="w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full pl-14 pr-5 py-5 bg-white/20 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                disabled={status === "loading"}
              >
                <option value="">Grade (optional)</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
                <option value="transfer">Transfer Student</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-blue-200"></div>
              </div>
            </div>

            {/* Graduation Year Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full pl-14 pr-5 py-5 bg-white/20 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                disabled={status === "loading"}
              >
                <option value="">Target graduation year (optional)</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-blue-200"></div>
              </div>
            </div>

            {/* Biggest Challenge Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Target className="w-5 h-5 text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <select
                value={biggestChallenge}
                onChange={(e) => setBiggestChallenge(e.target.value)}
                className="w-full pl-14 pr-5 py-5 bg-white/20 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                disabled={status === "loading"}
              >
                <option value="">Biggest challenge (optional)</option>
                <option value="deadlines">Deadlines</option>
                <option value="essays">Essays</option>
                <option value="scholarships">Scholarships</option>
                <option value="dont_know">Don't know</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-blue-200"></div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-gray-900 px-10 py-5 rounded-2xl font-semibold hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Joining Waitlist...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Join the waitlist
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          {/* Enhanced Privacy Notice */}
          <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-blue-100 text-sm font-medium">
              We use your info only to contact you about Sensei. No resale. Ever.
            </p>
          </div>

          {/* Enhanced Status Message */}
          {message && (
            <div className={`mt-6 p-6 rounded-2xl flex items-center gap-4 ${
              status === "success" 
                ? "bg-green-500/20 border border-green-400/30 text-green-100 backdrop-blur-sm" 
                : "bg-red-500/20 border border-red-400/30 text-red-100 backdrop-blur-sm"
            }`}>
              {status === "success" ? (
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Enhanced Social Proof */}
        <div className="mt-20 pt-12 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <p className="text-blue-100 text-lg mb-4 font-medium">Coming out of private beta.</p>
            <p className="text-blue-100 text-base">
              Want your school to pilot Sensei? <a href="mailto:hello@usesensei.app" className="text-white hover:underline font-medium">Email hello@usesensei.app</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
