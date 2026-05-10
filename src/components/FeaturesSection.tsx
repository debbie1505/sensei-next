"use client";
import { Users, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

const roles = [
  {
    title: "Students",
    description: "Run your full application in a single structured system.",
    details: "Schools, prompts, deadlines, and drafts stay connected.",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "#student-view",
  },
  {
    title: "Counselors",
    description: "Comment in context once students invite you in.",
    details: "See progress without chasing docs and email threads.",
    icon: <Users className="w-8 h-8" />,
    href: "#counselor-view",
  },
  {
    title: "Teachers",
    description: "Give targeted feedback tied to the exact prompt and deadline.",
    details: "No more hunting through disconnected files.",
    icon: <BookOpen className="w-8 h-8" />,
    href: "#teacher-view",
  },
];

const problems = [
  "Essays scattered across Google Docs.",
  "Deadlines tracked in memory or random spreadsheets.",
  "Feedback buried in comments and email threads.",
  "No clear picture of whether you are on track.",
];

const steps = [
  {
    step: "1",
    title: "Add schools, prompts, and deadlines once.",
    description: "Admitra creates the structure around your real application plan.",
  },
  {
    step: "2",
    title: "Draft essays inside that structure.",
    description: "Every draft stays tied to a specific school, prompt, and due date.",
  },
  {
    step: "3",
    title: "Collect feedback in context.",
    description: "Invite counselors and teachers to comment where it matters.",
  },
];

const differentiators = [
  "Notion and Docs store text; Admitra runs the process.",
  "Every essay is attached to prompt and deadline context.",
  "Progress visibility shows if you are actually on track.",
  "Collaboration is layered on after student adoption.",
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-background">
      {/* Who It's For */}
      <div className="py-20 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Start with the student workflow
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <a
                key={role.title}
                href={role.href}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-6 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {role.title}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {role.description}
                </p>
                <p className="text-muted-foreground text-sm">
                  {role.details}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* The Core Problem */}
      <div className="py-20 px-6 bg-secondary/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            The real problem is not writing. It is coordination chaos.
          </h2>
          <div className="space-y-4 mb-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-left max-w-md mx-auto"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <p className="text-lg text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl mx-auto">
            <p className="text-xl font-semibold text-foreground">
              Admitra replaces scattered tools with one connected application system.
            </p>
          </div>
        </div>
      </div>

      {/* How Admitra Works */}
      <div className="py-20 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
            The core loop
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why This Is Different */}
      <div className="py-20 px-6 bg-secondary/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Where essays, deadlines, and feedback actually connect.
          </h2>
          <p className="text-muted-foreground mb-12 text-lg">
            This is an application system, not a folder of docs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border text-left"
              >
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="py-20 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-card rounded-2xl border border-border">
              <p className="text-lg font-medium text-foreground mb-2">
                Built with students who needed more than documents.
              </p>
              <p className="text-muted-foreground text-sm">
                Structured workflows validated by real application cycles.
              </p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border">
              <p className="text-lg font-medium text-foreground mb-2">
                Collaboration is built in, not bolted on.
              </p>
              <p className="text-muted-foreground text-sm">
                Students can invite counselors and teachers directly in context.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equity Promise */}
      <div className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Our Promise
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Every student deserves guidance—not just those who can afford it.
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Admitra exists to level the playing field. We partner with public schools, 
                Title I districts, and community organizations to ensure college guidance 
                reaches every student, regardless of background.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">500:1</div>
                <p className="text-gray-400 text-sm">Average student-to-counselor ratio in US public schools</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">$200/hr</div>
                <p className="text-gray-400 text-sm">Cost of private college consultants</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">Free</div>
                <p className="text-gray-400 text-sm">Admitra for students at partner schools</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <p className="text-gray-400 text-sm">Schools already testing Admitra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
