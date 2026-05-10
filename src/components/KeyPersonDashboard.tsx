"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { FileText, Mail, User } from "lucide-react";

type Assignment = {
  id: string;
  student_id: string;
  role: "essay_reviewer" | "lor_writer";
  created_at: string;
};

export default function KeyPersonDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabase
        .from("key_person_assignments")
        .select("id, student_id, role, created_at")
        .eq("key_person_id", session.user.id)
        .order("created_at", { ascending: false });
      setAssignments(data ?? []);
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

  const essayStudents = assignments.filter((a) => a.role === "essay_reviewer");
  const lorStudents = assignments.filter((a) => a.role === "lor_writer");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Students you support</h1>
          <p className="text-muted-foreground mt-1">
            Students who have added you as a supporter for essays or recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Essay reviewer</span>
            </div>
            <div className="divide-y divide-border">
              {essayStudents.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  No students assigned for essay review.
                </div>
              ) : (
                essayStudents.map((a) => (
                  <Link
                    key={a.id}
                    href={`/dashboard/students/${a.student_id}`}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Student {a.student_id.slice(0, 8)}…</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Letter of recommendation</span>
            </div>
            <div className="divide-y divide-border">
              {lorStudents.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  No students assigned for LOR.
                </div>
              ) : (
                lorStudents.map((a) => (
                  <Link
                    key={a.id}
                    href={`/dashboard/students/${a.student_id}`}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Student {a.student_id.slice(0, 8)}…</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          You only see students who have added you as a supporter. Access their essays or recommendation materials from their detail page.
        </p>
      </div>
    </div>
  );
}
