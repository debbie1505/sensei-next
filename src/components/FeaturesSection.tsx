"use client";

import { Lightbulb, Calendar, MessageCircle } from "lucide-react";

const features = [
  {
    title: "AI Essay Feedback",
    description: "Get instant, actionable suggestions on your essays.",
    icon: <MessageCircle className="text-blue-600 mb-2" size={28} />,
  },
  {
    title: "Smart Timeline Builder",
    description: "Your personalized admissions calendar—automatically created.",
    icon: <Calendar className="text-blue-600 mb-2" size={28} />,
  },
  {
    title: "24/7 Admissions Mentor",
    description: "Ask anything, anytime. Your AI mentor is always ready.",
    icon: <Lightbulb className="text-blue-600 mb-2" size={28} />,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-6 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        What Sensei Can Do
      </h2>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="border rounded-lg shadow p-6 bg-gray-50 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
