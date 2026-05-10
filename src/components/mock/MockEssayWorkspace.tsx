"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, Save } from "lucide-react";
import {
  addEssayComment,
  addEssayVersion,
  DEFAULT_STUDENT_ID,
  getStudentSystem,
  updateCommentStatus,
} from "@/utils/mock/system";
import { getMockSession } from "@/utils/mock/auth";

export default function MockEssayWorkspace() {
  const [, setRefresh] = useState(0);
  const system = getStudentSystem(DEFAULT_STUDENT_ID);
  const selectedEssayId = system.essays[0]?.id ?? "";
  const activeEssay = system.essays.find((essay) => essay.id === selectedEssayId) ?? system.essays[0];
  const [draft, setDraft] = useState(activeEssay?.currentDraft ?? "");
  const [commentText, setCommentText] = useState("");
  const currentMockRole = getMockSession()?.role ?? "student";

  if (!activeEssay) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No essay contexts available.
      </div>
    );
  }

  const college = system.colleges.find((entry) => entry.id === activeEssay.collegeId);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-3xl font-bold text-foreground">Context-Aware Essay Workspace</h1>
          <p className="text-muted-foreground mt-2">
            Each draft is linked to school, prompt, deadline, and revision history.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">School</p>
              <p className="font-semibold text-foreground">{college?.schoolName}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="font-semibold text-foreground">{activeEssay.deadline}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Word Target</p>
              <p className="font-semibold text-foreground">{activeEssay.wordTarget}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Versions</p>
              <p className="font-semibold text-foreground">{activeEssay.versions.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-foreground">Draft in Context</h2>
              <button
                type="button"
                onClick={() => {
                  addEssayVersion(DEFAULT_STUDENT_ID, activeEssay.id, draft);
                  setRefresh((value) => value + 1);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                <Save className="w-4 h-4" />
                Save Version
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{activeEssay.prompt}</p>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="w-full min-h-[320px] rounded-lg border border-border bg-background p-3"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{draft.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>AI feedback: {activeEssay.feedbackSummary}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Version History</h2>
            <div className="space-y-2">
              {activeEssay.versions.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => setDraft(version.draft)}
                  className="w-full text-left rounded-lg border border-border p-3 hover:bg-accent"
                >
                  <p className="font-medium text-foreground">Version {version.versionNumber}</p>
                  <p className="text-xs text-muted-foreground">{version.createdAt.slice(0, 10)}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Structured Feedback System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {activeEssay.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {comment.commenterName} · {comment.commenterRole}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${commentStatusClass(comment.status)}`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-2">{comment.comment}</p>
                  {comment.targetText && (
                    <p className="text-xs text-muted-foreground mt-1">Target: “{comment.targetText}”</p>
                  )}
                  {currentMockRole === "student" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          updateCommentStatus(DEFAULT_STUDENT_ID, activeEssay.id, comment.id, "resolved");
                          setRefresh((value) => value + 1);
                        }}
                        className="text-xs px-3 py-1 rounded border border-border hover:bg-accent"
                      >
                        Addressed
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateCommentStatus(DEFAULT_STUDENT_ID, activeEssay.id, comment.id, "ignored");
                          setRefresh((value) => value + 1);
                        }}
                        className="text-xs px-3 py-1 rounded border border-border hover:bg-accent"
                      >
                        Ignored
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Add Feedback</h3>
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="w-full min-h-[120px] rounded-lg border border-border bg-background p-2 text-sm"
                placeholder="Comment directly in context..."
              />
              <button
                type="button"
                onClick={() => {
                  if (!commentText.trim()) return;
                  addEssayComment(DEFAULT_STUDENT_ID, activeEssay.id, {
                    commenterRole: currentMockRole,
                    commenterName: currentMockRole === "counselor" ? "Counselor Demo" : currentMockRole === "key_person" ? "Teacher Demo" : "Student Demo",
                    comment: commentText.trim(),
                  });
                  setCommentText("");
                  setRefresh((value) => value + 1);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </button>
              <p className="text-xs text-muted-foreground mt-3">
                Role-aware: comment status can be tracked as addressed vs ignored.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-border p-4 bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              AI Guide
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your weakest area is supplement clarity. Prioritize revising the second paragraph before submitting this week.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function commentStatusClass(status: "pending" | "resolved" | "ignored") {
  if (status === "resolved") return "bg-green-100 text-green-700";
  if (status === "ignored") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

