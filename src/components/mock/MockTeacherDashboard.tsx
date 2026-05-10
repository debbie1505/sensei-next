"use client";

import { FileText, Mail, UserRound } from "lucide-react";
import { addEssayComment, getStudentsForRole } from "@/utils/mock/system";

export default function MockTeacherDashboard() {
  const students = getStudentsForRole("key_person");
  const student = students[0];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No students assigned for this teacher mock account yet.
      </div>
    );
  }

  const essay = student.essays[0];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-3xl font-bold text-foreground">Teacher / Recommender Workspace</h1>
          <p className="text-muted-foreground mt-2">Give scoped feedback in-context and track recommendation requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Assigned Essays</h2>
            <div className="rounded-lg border border-border p-4 mb-4">
              <p className="font-medium text-foreground">{student.studentName}</p>
              <p className="text-sm text-muted-foreground mt-1">{essay.prompt}</p>
              <p className="text-xs text-muted-foreground mt-2">Deadline: {essay.deadline} · Target: {essay.wordTarget} words</p>
            </div>
            <button
              type="button"
              onClick={() => {
                addEssayComment(student.studentId, essay.id, {
                  commenterRole: "key_person",
                  commenterName: "Teacher Demo",
                  comment: "Strong story arc. Tighten your second paragraph and sharpen the conclusion.",
                });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              <FileText className="w-4 h-4" /> Add Feedback Comment
            </button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Recommendation Requests</h2>
            <div className="space-y-3">
              {student.recommendationRequests.map((request) => {
                const recommender = student.recommenders.find((item) => item.id === request.recommenderId);
                const college = student.colleges.find((item) => item.id === request.collegeId);
                return (
                  <div key={request.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-foreground">{college?.schoolName}</p>
                    <p className="text-xs text-muted-foreground">{recommender?.name} · Due {request.dueDate}</p>
                    <span className="mt-2 inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
            <a
              href="mailto:student@admitra.dev"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              <Mail className="w-4 h-4" />
              Request Draft Update
            </a>
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">Student Assignment Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {students.map((entry) => (
              <div key={entry.studentId} className="rounded-lg border border-border p-3">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <UserRound className="w-4 h-4" />
                  {entry.studentName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{entry.colleges.length} colleges · {entry.essays.length} essays</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

