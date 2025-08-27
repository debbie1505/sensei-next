"use client";
import { useState } from "react";
import { Calendar, MessageCircle, Target, Zap, CheckCircle, ArrowRight } from "lucide-react";

const valueProps = [
  {
    title: "Deadlines, solved.",
    description: "Your timeline auto-adapts to your target schools.",
    icon: <Calendar className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    borderColor: "border-blue-200/50",
    shadowColor: "shadow-blue-100/50"
  },
  {
    title: "Essays, leveled up.",
    description: "Specific, line-by-line coaching—no generic fluff.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100/50",
    borderColor: "border-green-200/50",
    shadowColor: "shadow-green-100/50"
  },
  {
    title: "Scholarships that actually fit.",
    description: "Matches based on your profile.",
    icon: <Target className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    borderColor: "border-purple-200/50",
    shadowColor: "shadow-purple-100/50"
  },
  {
    title: "Weekly plan that adapts.",
    description: "What to do this week, not vague \"work hard\" advice.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    borderColor: "border-orange-200/50",
    shadowColor: "shadow-orange-100/50"
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Tell Sensei your goals.",
    description: "Grade, schools.",
    icon: <CheckCircle className="w-6 h-6" />
  },
  {
    step: "2", 
    title: "Get a living plan.",
    description: "Tasks, reminders, timelines.",
    icon: <Calendar className="w-6 h-6" />
  },
  {
    step: "3",
    title: "Improve fast.",
    description: "Draft → feedback → revision.",
    icon: <ArrowRight className="w-6 h-6" />
  }
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        {/* Value Props */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            Value props
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

        {/* Secondary CTA after Value Props */}
        <div className="text-center mb-32">
          <button 
            onClick={() => {
              const element = document.getElementById('waitlist');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 text-lg"
          >
            Get early access
          </button>
        </div>

        {/* How it works */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {howItWorks.map((step, index) => (
            <div key={step.step} className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  {step.step}
                </div>
                {/* Connection line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-600 dark:to-purple-600 transform translate-x-4"></div>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-200 text-lg">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Secondary CTA after How It Works */}
        <div className="text-center mb-32">
          <button 
            onClick={() => {
              const element = document.getElementById('waitlist');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 text-lg"
          >
            Get early access
          </button>
        </div>

        {/* Equity Promise */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-16 border border-blue-200/50 dark:border-border/50 mb-32 shadow-xl text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full px-6 py-3 mb-8 text-sm font-medium text-blue-700 dark:text-blue-200 shadow-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Our Mission
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
              Equity Promise
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 leading-relaxed mb-8">
                Built to level the playing field—especially helpful if you don't have a private counselor. 
              </p>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200 leading-relaxed">
                Useful for everyone.
              </p>
            </div>
            
            {/* Visual elements */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <div className="flex items-center gap-3 bg-white/60 dark:bg-card/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 dark:border-border/50">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Accessible</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-card/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 dark:border-border/50">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Inclusive</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-card/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 dark:border-border/50">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Equitable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
