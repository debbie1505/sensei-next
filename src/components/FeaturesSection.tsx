"use client";
import { useState } from "react";
import { Lightbulb, Calendar, MessageCircle, Target, Zap, Users } from "lucide-react";

const features = [
  {
    title: "AI Essay Feedback",
    description: "Get instant, actionable suggestions on your essays with detailed rubrics and revision suggestions.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "Smart Timeline Builder",
    description: "Your personalized admissions calendar—automatically created based on your profile and goals.",
    icon: <Calendar className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    title: "Scholarship Matcher",
    description: "Find scholarships that match your profile with AI-powered recommendations and fit scores.",
    icon: <Target className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    title: "24/7 AI Mentor",
    description: "Ask anything, anytime. Your AI mentor is always ready to help with admissions questions.",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    title: "Progress Tracking",
    description: "Monitor your application progress with visual dashboards and milestone tracking.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    title: "Community Support",
    description: "Connect with other students and share experiences in our supportive community.",
    icon: <Users className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Stand Out
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From essay feedback to timeline management, Sensei provides all the tools you need 
            to navigate the college admissions process with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${feature.bgColor} ${feature.borderColor} hover:border-opacity-100`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 transition-transform duration-300 ${hoveredIndex === index ? 'scale-110' : ''}`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Ready to Transform Your College Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already using Sensei to navigate their college admissions with confidence.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('waitlist');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
