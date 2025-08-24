"use client";

import EssayReview from "@/components/EssayReview";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EssayReviewPage() {
  return (
    <ProtectedRoute>
      <EssayReview />
    </ProtectedRoute>
  );
}
