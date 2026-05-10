"use client";
import { useState } from "react";
import { Users, GraduationCap, BookOpen, ChevronRight } from "lucide-react";

type ViewType = "counselor" | "student" | "teacher";

const views: Record<ViewType, { title: string; icon: React.ReactNode; bullets: string[]; screenshot: React.ReactNode }> = {
  counselor: {
    title: "Counselor View",
    icon: <Users className="w-5 h-5" />,
    bullets: [
      "Review student progress without hunting through docs.",
      "Comment on drafts tied to prompt and due date.",
      "Guide students inside one shared application system.",
    ],
    screenshot: (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">Caseload Dashboard</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Students</h3>
            <span className="text-sm text-gray-500">142 total</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
              <div className="text-xs text-green-700 dark:text-green-300">On track</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">41</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">Needs attention</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">12</div>
              <div className="text-xs text-red-700 dark:text-red-300">At risk</div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Sarah M.", status: "Essay due in 3 days", colorClass: "bg-yellow-500" },
              { name: "James T.", status: "Waiting on 2 recommendations", colorClass: "bg-red-500" },
              { name: "Emily R.", status: "All applications submitted", colorClass: "bg-green-500" },
            ].map((student, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.status}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${student.colorClass}`} />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  student: {
    title: "Student System View",
    icon: <GraduationCap className="w-5 h-5" />,
    bullets: [
      "Add schools, prompts, and deadlines once.",
      "Write drafts in context, not isolated documents.",
      "See exactly what is on track and what is slipping.",
    ],
    screenshot: (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">My Applications</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Week</h3>
            <span className="text-sm text-gray-500">4 tasks due</span>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { task: "Finish Stanford essay", due: "Tomorrow", done: false },
              { task: "Submit Common App", due: "Oct 15", done: true },
              { task: "Request LOR from Mr. Chen", due: "Oct 20", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-5 h-5 rounded border-2 ${item.done ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center`}>
                  {item.done && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${item.done ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}>{item.task}</div>
                </div>
                <span className="text-xs text-gray-500">{item.due}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Essay Progress</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }} />
            </div>
            <div className="text-xs text-gray-500 mt-2">5 of 8 essays drafted</div>
          </div>
        </div>
      </div>
    ),
  },
  teacher: {
    title: "Teacher View",
    icon: <BookOpen className="w-5 h-5" />,
    bullets: [
      "Jump to the exact draft and prompt that needs input.",
      "Give actionable feedback in the right context.",
      "Avoid back-and-forth email chains and missing files.",
    ],
    screenshot: (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">My Commitments</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommendations</h3>
            <span className="text-sm text-gray-500">8 pending</span>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { student: "Sarah M.", school: "Stanford", due: "Nov 1", type: "LOR" },
              { student: "James T.", school: "MIT", due: "Nov 1", type: "LOR" },
              { student: "Emily R.", school: "Harvard", due: "Nov 15", type: "Essay Review" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{item.student}</div>
                  <div className="text-xs text-gray-500">{item.school} - {item.type}</div>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">Due {item.due}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
              <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">8</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">Pending</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export default function ProductPreview() {
  const [activeView, setActiveView] = useState<ViewType>("student");

  return (
    <section id="product-preview" className="py-24 px-6 bg-gradient-to-b from-secondary/40 via-background to-secondary/40 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          See how the system works
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Start with student workflow. Layer collaboration after.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-card rounded-2xl p-2 border border-border shadow-lg">
            {(Object.keys(views) as ViewType[]).map((key) => (
              <button
                key={key}
                id={`${key}-view`}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === key
                    ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {views[key].icon}
                <span className="hidden sm:inline">{views[key].title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Screenshot with 3D effect */}
          <div className="order-2 lg:order-1 relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 -z-10 transform scale-110" />
            
            {/* Main screenshot with perspective */}
            <div 
              className="transform transition-all duration-500 hover:scale-[1.02]"
              style={{
                perspective: "1000px",
              }}
            >
              <div 
                className="transform transition-transform duration-500 hover:rotate-y-2"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {views[activeView].screenshot}
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          {/* Bullets */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              {views[activeView].title}
            </h3>
            <ul className="space-y-6">
              {views[activeView].bullets.map((bullet, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-lg text-muted-foreground pt-1">{bullet}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
