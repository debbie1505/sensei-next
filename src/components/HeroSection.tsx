"use client";
import { ArrowRight, ChevronDown, Users, Shield, School } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-background pt-24 pb-24 px-6 min-h-[90vh] flex flex-col">
      <div className="max-w-6xl mx-auto flex-1">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your college application system, not just documents.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Keep essays, deadlines, and feedback connected in one structured workflow, so you always know what to do next and whether you are on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-colors text-lg flex items-center justify-center gap-2"
              >
                Get started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                className="border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent transition-colors text-lg"
              >
                Join the waitlist
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>Student-first by design</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Essays, deadlines, feedback connect</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground">
                <School className="w-4 h-4 text-primary" />
                <span>Invite counselors when you are ready</span>
              </div>
            </div>
          </div>

          {/* Right: Product Screenshot */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
              {/* Counselor Dashboard Mock */}
              <div className="bg-card p-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-sm text-muted-foreground">Counselor Dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-foreground">Your Caseload</div>
                    <div className="text-sm text-muted-foreground">142 students</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
                      <div className="text-xs text-green-700 dark:text-green-300">On track</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">41</div>
                      <div className="text-xs text-yellow-700 dark:text-yellow-300">Needs attention</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">12</div>
                      <div className="text-xs text-red-700 dark:text-red-300">At risk</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-accent" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Sarah M.</div>
                        <div className="text-xs text-muted-foreground">Essay due in 3 days</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-accent" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">James T.</div>
                        <div className="text-xs text-muted-foreground">Waiting on 2 recommendations</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Small callouts for other views */}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-lg shadow-lg border border-border p-3 text-xs">
              <div className="font-medium text-foreground">Student View</div>
              <div className="text-muted-foreground">Essays, tasks, deadlines</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card rounded-lg shadow-lg border border-border p-3 text-xs">
              <div className="font-medium text-foreground">Teacher View</div>
              <div className="text-muted-foreground">LORs, essay reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-auto pt-8">
        <button
          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
