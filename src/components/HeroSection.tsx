"use client";
import { ArrowDown, Users, Shield, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-teal-50/30 to-cyan-100/40 dark:from-gray-900 dark:via-teal-900/20 dark:to-cyan-900/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-20 right-20 w-4 h-4 bg-teal-500/30 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-cyan-500/20 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex-1 flex flex-col items-center justify-center pt-24 pb-32">
        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/50 rounded-full px-6 py-3 mb-8 text-sm font-medium text-teal-700 dark:text-teal-200 shadow-lg">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          For counselors and schools
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-300 dark:via-cyan-300 dark:to-teal-400 bg-clip-text text-transparent">
            Manage applications at scale.
          </span>
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          A centralized system that helps counselors run applications efficiently and helps students submit stronger, more competitive applications.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-10 py-5 rounded-full font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-teal-500/25 text-lg min-w-[200px]"
          >
            Get early access
          </button>
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-gray-300/50 dark:border-border/50 text-gray-700 dark:text-gray-100 px-10 py-5 rounded-full font-semibold hover:bg-white dark:hover:bg-card transition-all duration-300 transform hover:scale-105 shadow-lg text-lg min-w-[200px]"
          >
            Learn more
          </button>
        </div>

        <p className="text-gray-500 dark:text-gray-300 text-sm mb-10">
          Free during beta. No spam.
        </p>

        <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-border/50 shadow-lg max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Users className="w-5 h-5 text-teal-500 dark:text-teal-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Built with counselors, students, and schools</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Shield className="w-5 h-5 text-teal-500 dark:text-teal-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Privacy-first design</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Zap className="w-5 h-5 text-cyan-500 dark:text-cyan-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Early testers at 20+ schools</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 animate-bounce">
        <span className="text-sm font-medium">Scroll to explore</span>
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
}
