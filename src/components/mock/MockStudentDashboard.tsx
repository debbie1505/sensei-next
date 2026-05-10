"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  Mail,
  School,
  Sparkles,
} from "lucide-react";
import {
  type ApplicationStatus,
  DEFAULT_STUDENT_ID,
  type MockRequirement,
  getStudentSystem,
  type RecommendationStatus,
  type RequirementStatus,
  updateRecommendationRequestStatus,
  updateRequirementStatus,
} from "@/utils/mock/system";

export default function MockStudentDashboard() {
  const [, setRefresh] = useState(0);
  const system = getStudentSystem(DEFAULT_STUDENT_ID);
  const submittedRequirements = system.requirements.filter((req) => req.status === "submitted").length;
  const totalRequirements = Math.max(system.requirements.length, 1);
  const requirementProgress = Math.round((submittedRequirements / totalRequirements) * 100);
  const onTrackTasks = system.timelineTasks.filter((task) => task.status === "done").length;
  const behindTasks = system.timelineTasks.filter((task) => task.reminderState === "behind" || task.reminderState === "overdue").length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-3xl font-bold text-foreground">My Application System</h1>
          <p className="text-muted-foreground mt-2">
            One control center for colleges, essays, deadlines, feedback, and recommendation tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard label="Colleges" value={String(system.colleges.length)} icon={<School className="w-4 h-4" />} />
            <StatCard label="Requirements Submitted" value={`${submittedRequirements}/${totalRequirements}`} icon={<ClipboardList className="w-4 h-4" />} />
            <StatCard label="Tasks Completed" value={`${onTrackTasks}/${system.timelineTasks.length}`} icon={<CheckCircle2 className="w-4 h-4" />} />
            <StatCard label="Behind Tasks" value={String(behindTasks)} icon={<AlertTriangle className="w-4 h-4" />} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Application Dashboard</h2>
              <span className="text-sm text-muted-foreground">Brutally clear progress</span>
            </div>
            <div className="space-y-4">
              {system.colleges.map((college) => (
                <div key={college.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{college.schoolName}</p>
                      <p className="text-sm text-muted-foreground">{college.applicationRound} · Deadline {college.deadline}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusClass(college.status)}`}>
                      {college.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${college.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{college.progress}% complete</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">AI Guide</h2>
            <div className="space-y-3">
              {system.aiNudges.map((nudge) => (
                <div key={nudge.id} className={`rounded-lg p-3 border ${nudgeClass(nudge.severity)}`}>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5" />
                    <p className="text-sm">{nudge.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Application Requirements Tracker</h2>
              <span className="text-sm text-muted-foreground">{requirementProgress}% submitted</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {system.requirements.map((requirement) => (
                <div key={requirement.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-foreground">{requirement.title}</p>
                    <p className="text-xs text-muted-foreground">{requirement.type.replace("_", " ")} · Due {requirement.dueDate}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`inline-flex text-xs px-2 py-1 rounded-full ${reqStatusClass(requirement.status)}`}>
                      {requirement.status.replace("_", " ")}
                    </span>
                    <div className="flex gap-1 justify-end">
                      {(["not_started", "in_progress", "requested", "submitted"] as const).map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type="button"
                          onClick={() => {
                            updateRequirementStatus(DEFAULT_STUDENT_ID, requirement.id, nextStatus);
                            setRefresh((value) => value + 1);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            requirement.status === nextStatus ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
                          }`}
                        >
                          {shortReqStatus(nextStatus)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recommendation Letter Manager</h2>
            <div className="space-y-3 mb-5">
              {system.recommendationRequests.map((request) => {
                const recommender = system.recommenders.find((r) => r.id === request.recommenderId);
                const college = system.colleges.find((c) => c.id === request.collegeId);
                return (
                  <div key={request.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-foreground">{recommender?.name}</p>
                    <p className="text-xs text-muted-foreground">{recommender?.relationship} · {college?.schoolName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">Requested {request.requestedDate} · Due {request.dueDate}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${recStatusClass(request.status)}`}>
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {(["not_requested", "requested", "submitted", "declined"] as const).map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type="button"
                          onClick={() => {
                            updateRecommendationRequestStatus(DEFAULT_STUDENT_ID, request.id, nextStatus);
                            setRefresh((value) => value + 1);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            request.status === nextStatus ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"
                          }`}
                        >
                          {shortRecStatus(nextStatus)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/timeline" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90">
                <Calendar className="w-4 h-4" /> Timeline + Tasks
              </Link>
              <Link href="/essay" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-accent">
                <FileText className="w-4 h-4" /> Essay Workspace
              </Link>
              <a href="mailto:teacher@admitra.dev" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-accent">
                <Mail className="w-4 h-4" /> Remind Recommender
              </a>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-accent">
                Export Package
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}<span>{label}</span></div>
      <p className="text-2xl font-semibold text-foreground mt-2">{value}</p>
    </div>
  );
}

function statusClass(status: ApplicationStatus) {
  if (status === "submitted") return "bg-green-100 text-green-700";
  if (status === "in_progress") return "bg-blue-100 text-blue-700";
  return "bg-muted text-muted-foreground";
}

function reqStatusClass(status: RequirementStatus) {
  if (status === "submitted") return "bg-green-100 text-green-700";
  if (status === "requested") return "bg-amber-100 text-amber-700";
  if (status === "in_progress") return "bg-blue-100 text-blue-700";
  return "bg-muted text-muted-foreground";
}

function recStatusClass(status: RecommendationStatus) {
  if (status === "submitted") return "bg-green-100 text-green-700";
  if (status === "requested") return "bg-blue-100 text-blue-700";
  if (status === "declined") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

function nudgeClass(severity: "info" | "warning" | "critical") {
  if (severity === "critical") return "bg-red-50 border-red-200 text-red-700";
  if (severity === "warning") return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-blue-50 border-blue-200 text-blue-700";
}

function shortReqStatus(status: MockRequirement["status"]) {
  if (status === "not_started") return "Not";
  if (status === "in_progress") return "Doing";
  if (status === "requested") return "Req";
  return "Done";
}

function shortRecStatus(status: RecommendationStatus) {
  if (status === "not_requested") return "Not";
  if (status === "requested") return "Req";
  if (status === "submitted") return "Done";
  return "Declined";
}

