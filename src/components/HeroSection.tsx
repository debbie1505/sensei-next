"use client";
import { ArrowDown, Users, Shield, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-blue-900/30 dark:to-indigo-900/50 overflow-hidden pb-20">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-500/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Enhanced Badge */}
        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full px-6 py-3 mb-8 text-sm font-medium text-blue-700 dark:text-blue-200 shadow-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          AI-Powered College Applications
        </div>

        {/* Enhanced Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
            An AI mentor that keeps your applications moving.
          </span>
        </h1>

        {/* Enhanced Subhead */}
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Deadlines, essays, scholarships, strategy—organized in one place.
        </p>

        {/* Enhanced CTA Section */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button 
            onClick={() => {
              const element = document.getElementById('waitlist');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 rounded-full font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 text-lg min-w-[200px]"
          >
            Join the waitlist
          </button>
          <button 
            onClick={() => {
              const element = document.getElementById('features');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-gray-300/50 dark:border-border/50 text-gray-700 dark:text-gray-100 px-10 py-5 rounded-full font-semibold hover:bg-white dark:hover:bg-card transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg min-w-[200px]"
          >
            Learn more
          </button>
        </div>

        {/* Enhanced Microcopy */}
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-12">
          Free during beta. No spam.
        </p>

        {/* Enhanced Trust Bar - Better Structure */}
        <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-border/50 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Users className="w-5 h-5 text-blue-500 dark:text-blue-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Built with students, parents, and counselors</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Shield className="w-5 h-5 text-green-500 dark:text-green-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Privacy-first design</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-card/50 rounded-xl border border-gray-200/30 dark:border-border/30">
              <Zap className="w-5 h-5 text-yellow-500 dark:text-yellow-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Early testers at 20+ schools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator - Fixed positioning */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
