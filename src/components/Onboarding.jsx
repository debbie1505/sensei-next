"use client";
import React, { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    year: "",
    applicantType: "",
    testScores: "",
    collegeType: "",
    goals: "",
  });
  // This goes at the top of the component (inside the component body)
  const submitOnboarding = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      return;
    }

    const mappedFormData = {
      id: user.id,
      year: formData.year,
      applicant_type: formData.applicantType,
      test_scores: formData.testScores,
      college_type: formData.collegeType,
      goals: formData.goals,
    };

    console.log("Submiting onboarding", mappedFormData, "User ID", user.id);
    const { error } = await supabase.from("users").upsert([mappedFormData]);
    console.log("Submiting onboarding", mappedFormData, "User ID", user.id);

    if (error) {
      console.error("Insert error:", error.message);
    } else {
      console.log("Onboarding submitted successfully");
      router.push("/dashboard");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">What year are you in?</h2>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
              <option value="transfer">College Transfer</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              What type of applicant are you?
            </h2>
            <select
              name="applicantType"
              value={formData.applicantType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
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
            <select
              name="testScores"
              value={formData.testScores}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              What kind of colleges are you aiming for?
            </h2>
            <select
              name="collegeType"
              value={formData.collegeType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
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
            <h2 className="text-xl font-bold mb-4">
              What are your goals or interests?
            </h2>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Tell us your goals..."
              className="border p-2 rounded w-full"
            />
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All set!</h2>
            <p className="mb-4">
              Click submit to save your info and get started
            </p>
            <button
              onClick={submitOnboarding}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {step < 6 && (
          <button
            onClick={nextStep}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
