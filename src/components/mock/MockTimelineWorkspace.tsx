"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, Plus } from "lucide-react";
import {
  addManualTask,
  DEFAULT_STUDENT_ID,
  exportApplicationPackage,
  generateWeeklyPlan,
  getStudentSystem,
  markTaskStatus,
} from "@/utils/mock/system";

export default function MockTimelineWorkspace() {
  const [, setRefresh] = useState(0);
  const [manualTitle, setManualTitle] = useState("");
  const system = getStudentSystem(DEFAULT_STUDENT_ID);

  const sortedTasks = [...system.timelineTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const downloadPackage = () => {
    const pack = exportApplicationPackage(DEFAULT_STUDENT_ID);
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admitra-application-package-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground">Smart Timeline Generator</h1>
          <p className="text-muted-foreground mt-2">
            Weekly task plan linked to schools and requirements. Auto-adjust when you fall behind.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                generateWeeklyPlan(DEFAULT_STUDENT_ID);
                setRefresh((value) => value + 1);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              <Calendar className="w-4 h-4" />
              Auto-adjust Weekly Plan
            </button>
            <button
              type="button"
              onClick={downloadPackage}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              <Download className="w-4 h-4" />
              Export Full Package
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">Add Manual Task</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={manualTitle}
              onChange={(event) => setManualTitle(event.target.value)}
              placeholder="Example: Request transcript follow-up"
              className="flex-1 rounded-lg border border-border px-3 py-2 bg-background"
            />
            <button
              type="button"
              onClick={() => {
                if (!manualTitle.trim()) return;
                addManualTask(DEFAULT_STUDENT_ID, {
                  title: manualTitle.trim(),
                  dueDate: new Date().toISOString().slice(0, 10),
                  weekLabel: "This Week",
                  status: "todo",
                  priority: "medium",
                  category: "other",
                  reminderState: "none",
                });
                setManualTitle("");
                setRefresh((value) => value + 1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.weekLabel} · Due {task.dueDate} · {task.priority} priority · {task.category}
                  </p>
                  {task.reminderState && task.reminderState !== "none" && (
                    <p className="text-xs mt-1 text-amber-700">Reminder: {task.reminderState.replace("_", " ")}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(["todo", "doing", "done", "blocked"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        markTaskStatus(DEFAULT_STUDENT_ID, task.id, status);
                        setRefresh((value) => value + 1);
                      }}
                      className={`text-xs px-2 py-1 rounded border ${
                        task.status === status
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

