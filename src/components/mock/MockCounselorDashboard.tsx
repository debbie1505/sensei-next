"use client";

import { AlertTriangle, CheckCircle2, FileText, UserRound } from "lucide-react";
import {
  DEFAULT_COUNSELOR_ID,
  updateCommentStatus,
  getStudentsForRole,
} from "@/utils/mock/system";

export default function MockCounselorDashboard() {
  const students = getStudentsForRole("counselor");
  const student = students[0];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No students linked to this counselor mock account yet.
      </div>
    );
  }

  const essay = student.essays[0];
  const pendingComments = essay.comments.filter((comment) => comment.status === "pending").length;
  const resolvedComments = essay.comments.filter((comment) => comment.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-3xl font-bold text-foreground">Counselor Workflow</h1>
          <p className="text-muted-foreground mt-2">Review student progress, intervene early, and track which feedback is addressed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Assigned Students" value={String(students.length)} icon={<UserRound className="w-4 h-4" />} />
          <MetricCard label="Pending Feedback Items" value={String(pendingComments)} icon={<AlertTriangle className="w-4 h-4" />} />
          <MetricCard label="Resolved Feedback" value={String(resolvedComments)} icon={<CheckCircle2 className="w-4 h-4" />} />
        </div>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Structured Feedback System</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Track exactly what feedback was addressed versus ignored.
          </p>
          <div className="space-y-3">
            {essay.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{comment.commenterName} · {comment.commenterRole}</p>
                    <p className="text-xs text-muted-foreground">{comment.createdAt.slice(0, 10)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusClass(comment.status)}`}>
                    {comment.status}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-3">{comment.comment}</p>
                {comment.targetText && (
                  <p className="text-xs text-muted-foreground mt-2">Target: “{comment.targetText}”</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      updateCommentStatus(student.studentId, essay.id, comment.id, "resolved");
                      window.location.reload();
                    }}
                    className="text-xs px-3 py-1 rounded border border-border hover:bg-accent"
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateCommentStatus(student.studentId, essay.id, comment.id, "ignored");
                      window.location.reload();
                    }}
                    className="text-xs px-3 py-1 rounded border border-border hover:bg-accent"
                  >
                    Mark Ignored
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">At-Risk Signals</h2>
          <div className="space-y-3">
            {student.timelineTasks
              .filter((task) => task.reminderState === "behind" || task.reminderState === "overdue")
              .map((task) => (
                <div key={task.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{task.title} · Due {task.dueDate}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Encourage student to prioritize supplements due within 10 days.
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-sm text-muted-foreground flex items-center gap-2">{icon}{label}</div>
      <p className="text-2xl font-semibold text-foreground mt-2">{value}</p>
    </div>
  );
}

function statusClass(status: "pending" | "resolved" | "ignored") {
  if (status === "resolved") return "bg-green-100 text-green-700";
  if (status === "ignored") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export const mockCounselorId = DEFAULT_COUNSELOR_ID;

