"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Users, AlertTriangle, FileText, Calendar, ChevronRight } from "lucide-react";

type StudentRow = {
  user_id: string;
  grade?: number | null;
  goals?: string | null;
  applicant_type?: string | null;
};

export default function CounselorDashboard() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("user_id", session.user.id)
        .single();

      if (profileError) {
        console.error("Failed to load counselor profile:", profileError);
        setLoading(false);
        return;
      }

      if (!profile?.school_id) {
        setLoading(false);
        return;
      }

      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .select("name")
        .eq("id", profile.school_id)
        .single();
      if (schoolError) {
        console.error("Failed to load school:", schoolError);
      }
      setSchoolName(school?.name ?? null);

      const { data: studentList, error: studentError } = await supabase
        .from("profiles")
        .select("user_id, grade, goals, applicant_type")
        .eq("school_id", profile.school_id)
        .eq("role", "student");
      if (studentError) {
        console.error("Failed to load students:", studentError);
      }
      setStudents(studentList ?? []);

      const { count } = await supabase
        .from("alerts")
        .select("*", { count: "exact", head: true })
        .eq("counselor_id", session.user.id)
        .is("read_at", null);
      setAlertsCount(count ?? 0);

      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Caseload</h1>
          <p className="text-muted-foreground mt-1">
            {schoolName ? `${schoolName} — ` : ""}
            Students in your school
          </p>
        </div>

        {alertsCount > 0 && (
          <Link
            href="/dashboard/alerts"
            className="mb-8 flex items-center gap-3 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{alertsCount} unread alert{alertsCount !== 1 ? "s" : ""}</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </Link>
        )}

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Students</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {students.length === 0 ? (
              <div className="px-6 py-16 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students in your caseload yet.</p>
                <p className="text-sm mt-1">Students from your school will appear here once they join Sensei.</p>
              </div>
            ) : (
              students.map((s) => (
                <Link
                  key={s.user_id}
                  href={`/dashboard/students/${s.user_id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {s.grade ? `G${s.grade}` : "—"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      Student {s.user_id.slice(0, 8)}…
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.applicant_type || "Applicant"} {s.goals ? " · " + s.goals.slice(0, 40) + (s.goals.length > 40 ? "…" : "") : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Essays
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Timeline
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard"
            className="p-6 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors"
          >
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Timeline</h3>
            <p className="text-sm text-muted-foreground mt-1">View your own timeline and tasks.</p>
          </Link>
          <div className="p-6 rounded-2xl border border-border bg-card opacity-90">
            <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-semibold text-foreground">Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">Missed deadlines and low engagement surface here.</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card opacity-90">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Essay feedback</h3>
            <p className="text-sm text-muted-foreground mt-1">Review and comment on student essays.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
