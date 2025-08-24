"use client";

import Scholarships from "@/components/Scholarships";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ScholarshipsPage() {
  return (
    <ProtectedRoute>
      <Scholarships />
    </ProtectedRoute>
  );
}
