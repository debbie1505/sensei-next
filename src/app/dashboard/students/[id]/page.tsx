"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Calendar, User } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function StudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to caseload
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Student detail</h1>
        <p className="text-muted-foreground mb-8 font-mono text-sm">{params.id}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Essays</h3>
            <p className="text-sm text-muted-foreground mt-1">View and comment on this student&apos;s essays.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Timeline</h3>
            <p className="text-sm text-muted-foreground mt-1">Tasks and deadlines for this student.</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <User className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground">Notes</h3>
          <p className="text-sm text-muted-foreground mt-1">Counselor notes and prioritization (coming soon).</p>
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <StudentDetailWrapper params={params} />
    </ProtectedRoute>
  );
}

async function StudentDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentDetailPage params={{ id }} />;
}
