"use client";
import { useState } from "react";
import { addToWaitlist } from "@/utils/supabase/waitlist";
import { Mail, CheckCircle, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
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
      setMessage("You're on the waitlist! 🎉 We'll notify you when Sensei launches.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="py-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6 text-sm font-medium text-white">
            <Sparkles className="w-4 h-4" />
            Early Access
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Be the First to Experience{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Sensei
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive waitlist and get early access to the most advanced AI-powered college admissions platform. 
            Plus, get special founding member benefits when we launch.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-blue-200" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                disabled={status === "loading"}
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Joining Waitlist...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Join the Waitlist
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
              status === "success" 
                ? "bg-green-500/20 border border-green-400/30 text-green-100" 
                : "bg-red-500/20 border border-red-400/30 text-red-100"
            }`}>
              {status === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-300" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-300" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
            <p className="text-blue-100 text-sm">Be among the first to try Sensei's features</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Founding Member</h3>
            <p className="text-blue-100 text-sm">Get exclusive benefits and discounts</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Priority Support</h3>
            <p className="text-blue-100 text-sm">Get help when you need it most</p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-blue-100 text-sm mb-4">Join 2,500+ students already on the waitlist</p>
          <div className="flex justify-center gap-8 text-blue-100 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2,500+</div>
              <div>Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">150+</div>
              <div>Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div>Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
