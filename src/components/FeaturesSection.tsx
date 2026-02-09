"use client";
import { Users, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

const roles = [
  {
    title: "Counselors",
    description: "Manage hundreds of students without losing track.",
    details: "Dashboards, deadlines, risk flags.",
    icon: <Users className="w-8 h-8" />,
    href: "#counselor-view",
  },
  {
    title: "Teachers",
    description: "Review essays and manage recommendation letters in one place.",
    details: "See commitments clearly.",
    icon: <BookOpen className="w-8 h-8" />,
    href: "#teacher-view",
  },
  {
    title: "Students",
    description: "Write stronger applications without juggling tools.",
    details: "Everything in one workspace.",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "#student-view",
  },
];

const problems = [
  "Deadlines live in spreadsheets.",
  "Essays live in Google Docs.",
  "Recommendations live in inboxes.",
  "Counselors are overloaded.",
  "Students are left to manage it all.",
];

const steps = [
  {
    step: "1",
    title: "Students work in one application workspace.",
    description: "Essays, timelines, scholarships, tasks.",
  },
  {
    step: "2",
    title: "Counselors oversee progress.",
    description: "Dashboards, alerts, student risk flags.",
  },
  {
    step: "3",
    title: "Teachers contribute where needed.",
    description: "Limited access for essays and recommendations.",
  },
];

const differentiators = [
  "Built for schools, not just individuals.",
  "AI supports decisions—it doesn't replace educators.",
  "Designed for coordination, not just content.",
  "Accessible to students without private consultants.",
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white dark:bg-background">
      {/* Who It's For */}
      <div className="py-20 px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Who it&apos;s for
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 text-lg">
            Let visitors self-identify in 5 seconds.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <a
                key={role.title}
                href={role.href}
                className="group p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-gray-900 mb-6 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {role.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {role.description}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {role.details}
                </p>
                <div className="mt-4 flex items-center gap-2 text-gray-900 dark:text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* The Core Problem */}
      <div className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
            The college application process breaks down at coordination.
          </h2>
          <div className="space-y-4 mb-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-left max-w-md mx-auto"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <p className="text-lg text-gray-700 dark:text-gray-300">{problem}</p>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              Sensei replaces fragmentation with one shared system.
            </p>
          </div>
        </div>
      </div>

      {/* How Sensei Works */}
      <div className="py-20 px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
            How Sensei works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why This Is Different */}
      <div className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Not another essay tool. Not another checklist.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
            Built different, on purpose.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="py-20 px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Built in collaboration with counselors and educators.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Real feedback from real schools.
              </p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Designed by someone who went through the process.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We know what students actually need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
