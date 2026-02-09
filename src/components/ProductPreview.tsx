"use client";
import { useState } from "react";
import { Users, GraduationCap, BookOpen, ChevronRight } from "lucide-react";

type ViewType = "counselor" | "student" | "teacher";

const views: Record<ViewType, { title: string; icon: React.ReactNode; bullets: string[]; screenshot: React.ReactNode }> = {
  counselor: {
    title: "Counselor View",
    icon: <Users className="w-5 h-5" />,
    bullets: [
      "Monitor all students at a glance.",
      "Track deadlines and submissions.",
      "Identify who needs attention early.",
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
              { name: "Sarah M.", status: "Essay due in 3 days", color: "yellow" },
              { name: "James T.", status: "Waiting on 2 recommendations", color: "red" },
              { name: "Emily R.", status: "All applications submitted", color: "green" },
            ].map((student, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.status}</div>
                </div>
                <div className={`w-2 h-2 rounded-full bg-${student.color}-500`} />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  student: {
    title: "Student View",
    icon: <GraduationCap className="w-5 h-5" />,
    bullets: [
      "One workspace for all applications.",
      "AI-assisted essay feedback.",
      "Deadlines and tasks that adapt to your schools.",
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
      "See all recommendation requests.",
      "Review assigned essays.",
      "Clear commitments, no email chains.",
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
  const [activeView, setActiveView] = useState<ViewType>("counselor");

  return (
    <section id="product-preview" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
          See the product
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12 text-lg">
          Three views. One system.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1.5 border border-gray-200 dark:border-gray-700 shadow-sm">
            {(Object.keys(views) as ViewType[]).map((key) => (
              <button
                key={key}
                id={`${key}-view`}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeView === key
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {views[key].icon}
                <span className="hidden sm:inline">{views[key].title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Screenshot */}
          <div className="order-2 lg:order-1">
            {views[activeView].screenshot}
          </div>

          {/* Bullets */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {views[activeView].title}
            </h3>
            <ul className="space-y-4">
              {views[activeView].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white dark:text-gray-900 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{bullet}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
