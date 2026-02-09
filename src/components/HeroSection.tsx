"use client";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-white dark:bg-background pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              One place to manage the entire college application process.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Sensei helps counselors, teachers, and students coordinate essays, recommendations, deadlines, and guidance—without email chaos or expensive private consultants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-lg flex items-center justify-center gap-2"
              >
                Request a pilot
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg"
              >
                Join the waitlist
              </button>
            </div>
          </div>

          {/* Right: Product Screenshot */}
          <div className="relative">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              {/* Counselor Dashboard Mock */}
              <div className="bg-white dark:bg-card p-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">Counselor Dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Your Caseload</div>
                    <div className="text-sm text-gray-500">142 students</div>
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
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Sarah M.</div>
                        <div className="text-xs text-gray-500">Essay due in 3 days</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">James T.</div>
                        <div className="text-xs text-gray-500">Waiting on 2 recommendations</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Small callouts for other views */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Student View</div>
              <div className="text-gray-500">Essays, tasks, deadlines</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-xs">
              <div className="font-medium text-gray-900 dark:text-white">Teacher View</div>
              <div className="text-gray-500">LORs, essay reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
