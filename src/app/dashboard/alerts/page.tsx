"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function AlertsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to caseload
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
        <p className="text-muted-foreground mb-8">
          Missed deadlines, low engagement, and essay risk flags will appear here.
        </p>
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No alerts right now.</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <AlertsPage />
    </ProtectedRoute>
  );
}
