"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
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
      grade,
      applicant_type: formData.applicantType || null,
      college_type: formData.collegeType || null,
      goals: formData.goals || null,
    };

    // Upsert by user_id; requires PK or UNIQUE on user_id
    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single(); // forces RLS evaluation now

    if (error) {
      console.error("Onboarding upsert error:", {
        code: (error as any).code,
        message: error.message,
        details: (error as any).details,
        hint: (error as any).hint,
      });
      alert("Failed to save your information. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What year are you in?</h2>
            <select name="year" value={formData.year} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
              {/* Remove "transfer" from year; capture that in applicantType */}
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What type of applicant are you?</h2>
            <select name="applicantType" value={formData.applicantType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              <option value="first-year">First-Year</option>
              <option value="transfer">Transfer</option>
              <option value="intl">International</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Do you have test scores?</h2>
            <select name="testScores" value={formData.testScores} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What kind of colleges are you aiming for?</h2>
            <select name="collegeType" value={formData.collegeType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select</option>
              <option value="ivies">Ivies / T20</option>
              <option value="in-state">In-State</option>
              <option value="private">Private, non-Ivy</option>
              <option value="safety">Just want a good fit</option>
            </select>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What are your goals or interests?</h2>
            <textarea name="goals" value={formData.goals} onChange={handleChange} placeholder="Tell us your goals..." className="border p-2 rounded w-full" />
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All set!</h2>
            <p className="mb-4">Click submit to save your info and get started</p>
            <button onClick={submitOnboarding} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Submit
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
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Back
          </button>
        )}
        {step < 6 && (
          <button onClick={nextStep} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
