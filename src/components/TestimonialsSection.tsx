"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "When can I use it?",
    answer: "Rolling invites during beta."
  },
  {
    question: "How much will it cost?",
    answer: "Free during beta; student pricing later."
  },
  {
    question: "Does Sensei write essays?",
    answer: "No—coaching only."
  },
  {
    question: "Data privacy?",
    answer: "No resale; delete anytime."
  },
  {
    question: "Age?",
    answer: "13+ only."
  }
];

export default function TestimonialsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="testimonials" className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-blue-900/30 dark:to-indigo-900/50 py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full px-6 py-3 mb-8 text-sm font-medium text-blue-700 dark:text-blue-200 shadow-lg">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            FAQ
          </h2>
        </div>

        {/* Enhanced FAQ Accordion */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="group bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 dark:border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-accent/30 transition-all duration-300 group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/20"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-lg pr-4">{faq.question}</span>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                    {openIndex === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-200 text-lg leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary CTA near FAQ */}
        <div className="mt-16 text-center">
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

        {/* Compliance & Privacy Callout */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-border/50 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Trust & Privacy</h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              We don't sell data. You can delete your account anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</a>
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms</a>
              <a href="mailto:hello@usesensei.app" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
