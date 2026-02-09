"use client";
import { useState } from "react";
import { Calendar, MessageCircle, Target, Zap, CheckCircle, ArrowRight } from "lucide-react";

const valueProps = [
  {
    title: "One place for your caseload.",
    description: "See all students, deadlines, and risk in one dashboard.",
    icon: <Calendar className="w-8 h-8" />,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-teal-50 to-teal-100/50",
    borderColor: "border-teal-200/50",
    shadowColor: "shadow-teal-100/50"
  },
  {
    title: "Essays with AI + your feedback.",
    description: "AI coaching plus inline counselor comments and approval.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
    borderColor: "border-cyan-200/50",
    shadowColor: "shadow-cyan-100/50"
  },
  {
    title: "Alerts that matter.",
    description: "Missed deadlines, low engagement, weak essays—surfaced for you.",
    icon: <Target className="w-8 h-8" />,
    color: "from-teal-600 to-cyan-600",
    bgColor: "bg-gradient-to-br from-teal-50 to-cyan-100/50",
    borderColor: "border-teal-200/50",
    shadowColor: "shadow-teal-100/50"
  },
  {
    title: "Students stay on track.",
    description: "Timelines and tasks adapt to their schools; you oversee progress.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-cyan-600 to-teal-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-teal-100/50",
    borderColor: "border-cyan-200/50",
    shadowColor: "shadow-cyan-100/50"
  },
];

const howItWorks = [
  { step: "1", title: "Your school joins Sensei.", description: "Counselors and students get access.", icon: <CheckCircle className="w-6 h-6" /> },
  { step: "2", title: "Students work in one workspace.", description: "Essays, timelines, scholarships—all in one place.", icon: <Calendar className="w-6 h-6" /> },
  { step: "3", title: "You monitor and intervene.", description: "Alerts, progress, and feedback tools when it matters.", icon: <ArrowRight className="w-6 h-6" /> },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-br from-white via-gray-50/30 to-teal-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-teal-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            Built for how counselors work
          </h2>
        </div>

        {/* Value Props Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-32">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 ${prop.bgColor} dark:bg-card/50 ${prop.borderColor} dark:border-border/50 hover:border-opacity-100 shadow-lg ${prop.shadowColor} dark:shadow-gray-900/50`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${prop.color} text-white mb-6 transition-all duration-500 ${hoveredIndex === index ? 'scale-110 rotate-3' : ''} shadow-lg`}>
                {prop.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                {prop.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-200 leading-relaxed text-sm">
                {prop.description}
              </p>

              {/* Enhanced Hover effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${prop.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${prop.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
            </div>
          ))}
        </div>

        <div className="text-center mb-32">
          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-10 py-4 rounded-full font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-teal-500/25 text-lg"
          >
            Get early access
          </button>
        </div>

        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {howItWorks.map((step, index) => (
            <div key={step.step} className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  {step.step}
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-600 dark:to-cyan-600 transform translate-x-4" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-200 text-lg">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-24">
          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-10 py-4 rounded-full font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-teal-500/25 text-lg"
          >
            Get early access
          </button>
        </div>
      </div>
    </section>
  );
}
