"use client"
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function EssayReview() {
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);

    try {
      // 1. Call OpenAI to get feedback
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a college admissions expert. Provide clear and structured feedback on the student's essay with suggestions for improvement.",
              },
              {
                role: "user",
                content: `Please review this college application essay:\n\n${essay}`,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const aiFeedback = data.choices[0].message.content;
        setFeedback(aiFeedback);
        // get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User not found or auth error:", userError);
          setLoading(false);
          return;
        }
        const { data: insertData, error: insertError } = await supabase
          .from("essay_submissions")
          .insert([{ user_id: user.id, essay, feedback: aiFeedback }]);

        if (insertError) {
          console.error("Insert failed:", insertError);
        } else {
          console.log("Insert successful:", insertData);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during review:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Essay Review 🧠</h1>

      <textarea
        className="w-full h-48 p-4 border rounded mb-4"
        placeholder="Paste your college essay here..."
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
      />

      <button
        onClick={handleReview}
        disabled={loading || essay.length < 100}
        className={`px-4 py-2 rounded text-black ${
          loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Reviewing..." : "Get Feedback"}
      </button>

      {feedback && (
        <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {feedback}
        </div>
      )}
    </div>
  );
}
