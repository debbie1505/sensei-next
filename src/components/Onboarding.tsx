"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  getPricingPlanLabel,
  isPricingPlanId,
  PRICING_SELECTION_KEY,
  type PricingPlanId,
} from "@/utils/pricingSelection";

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId | null>(null);
  const [formData, setFormData] = useState({
    role: "" as "" | "student" | "counselor" | "key_person",
    year: "",
    applicantType: "",
    testScores: "",
    collegeType: "",
    goals: "",
  });

  // Auth gate with subscription (prevents race/loop)
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) router.replace("/login");
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      if (!session) router.replace("/login");
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [router]);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (isPricingPlanId(planParam)) {
      setSelectedPlan(planParam);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PRICING_SELECTION_KEY, planParam);
      }
      return;
    }

    if (typeof window !== "undefined") {
      const persistedPlan = window.localStorage.getItem(PRICING_SELECTION_KEY);
      if (isPricingPlanId(persistedPlan)) {
        setSelectedPlan(persistedPlan);
      }
    }
  }, [searchParams]);

  const submitOnboarding = async () => {
    const supabase = createClient();

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      router.replace("/login");
      return;
    }

    // Coerce grade safely; non-numeric becomes null
    const grade = /^\d+$/.test(formData.year) ? Number(formData.year) : null;

    const payload = {
      user_id: session.user.id,
      role: formData.role || "student",
      grade,
      applicant_type: formData.applicantType || null,
      college_type: formData.collegeType || null,
      goals: formData.goals || null,
    };

    // Upsert by user_id; requires PK or UNIQUE on user_id
    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    // Debug: log the full response
    console.log("Upsert response - error object:", error);
    console.log("Upsert response - error keys:", error ? Object.keys(error) : "null");
    console.log("Upsert response - error stringified:", JSON.stringify(error));
    
    // Only treat as error if there's an actual error message
    if (error?.message) {
      console.error("Onboarding upsert error:", error.message);
      alert("Failed to save your information: " + error.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    // Validate required fields before advancing
    if (step === 1 && !formData.role) {
      alert("Please select your role before continuing.");
      return;
    }
    setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Who are you in this application process?</h2>
            <p className="text-muted-foreground mb-4">We will tailor your workflow and dashboard to this role.</p>
            <select name="role" value={formData.role} onChange={handleChange} className="border border-input p-2 rounded w-full bg-background">
              <option value="">Select</option>
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
              <option value="key_person">Supporter (Teacher, Mentor, Family)</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Where are you in your timeline?</h2>
            <select name="year" value={formData.year} onChange={handleChange} className="border border-input p-2 rounded w-full bg-background">
              <option value="">Select</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What is your application path?</h2>
            <select name="applicantType" value={formData.applicantType} onChange={handleChange} className="border border-input p-2 rounded w-full bg-background">
              <option value="">Select</option>
              <option value="first-year">First-Year</option>
              <option value="transfer">Transfer</option>
              <option value="intl">International</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Do you want test scores included in your plan?</h2>
            <select name="testScores" value={formData.testScores} onChange={handleChange} className="border border-input p-2 rounded w-full bg-background">
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Which schools are you targeting first?</h2>
            <select name="collegeType" value={formData.collegeType} onChange={handleChange} className="border border-input p-2 rounded w-full bg-background">
              <option value="">Select</option>
              <option value="ivies">Ivies / T20</option>
              <option value="in-state">In-State</option>
              <option value="private">Private, non-Ivy</option>
              <option value="safety">Just want a good fit</option>
            </select>
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What outcomes should this system optimize for?</h2>
            <textarea name="goals" value={formData.goals} onChange={handleChange} placeholder="Example: top choices, intended major, scholarship targets..." className="border border-input p-2 rounded w-full bg-background min-h-[100px]" />
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your system is ready</h2>
            <p className="mb-4">Save this setup to generate your structured dashboard and timeline.</p>
            <button onClick={submitOnboarding} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
              Save and continue
            </button>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Thanks! 🎉</h2>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {selectedPlan && (
        <div className="mb-5 rounded-lg border border-border bg-secondary/50 px-4 py-3">
          <p className="text-sm text-foreground">
            Plan selected:{" "}
            <span className="font-semibold">{getPricingPlanLabel(selectedPlan)}</span>
          </p>
        </div>
      )}
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button onClick={prevStep} className="px-4 py-2 bg-muted rounded hover:bg-muted/80">
            Back
          </button>
        )}
        {step < 7 && (
          <button onClick={nextStep} className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
