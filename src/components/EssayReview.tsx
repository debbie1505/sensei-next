"use client"
import React, { useState } from "react";
import { createClient } from "../utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Star, Edit3, RotateCcw } from "lucide-react";
import { EssayMode } from "@/llm/provider";
import { type EssayReview } from "@/llm/schemas";

export default function EssayReview() {
  const [essay, setEssay] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<EssayMode>('standard');
  const [feedback, setFeedback] = useState<EssayReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRevised, setShowRevised] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/essay/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft: essay,
          mode,
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }

      const result = await response.json();
      if (result.success) {
        setFeedback(result.data.feedback);
      } else {
        setError(result.error || 'Failed to generate feedback');
      }
    } catch (error) {
      console.error("Error during review:", error);
      setError("An error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!feedback) return;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Update the essay with rating
      await supabase
        .from('essays')
        .update({ rating })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 5) return 'Excellent';
    if (score >= 4) return 'Good';
    if (score >= 3) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mb-2">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Essay Review</h1>
          </div>
          <p className="text-gray-600">Get structured AI feedback on your college application essay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Review Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'standard', 'rewrite'] as EssayMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      mode === m
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{m}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {m === 'light' && 'Quick feedback'}
                      {m === 'standard' && 'Detailed analysis'}
                      {m === 'rewrite' && 'Complete revision'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Essay Prompt */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Essay Prompt (Optional)
              </label>
              <textarea
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Paste the essay prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Essay Input */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Essay
              </label>
              <textarea
                className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Paste your college essay here... (minimum 100 characters)"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
              />
              <div className="mt-2 text-sm text-gray-500">
                {essay.length} characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleReview}
              disabled={loading || essay.length < 100}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || essay.length < 100
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Essay...
                </div>
              ) : (
                "Get AI Feedback"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {feedback && (
            <div className="space-y-6">
              {/* Rubric Scores */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rubric Scores</h2>
                <div className="grid grid-cols-2 gap-4">
                                     {[
                     { key: 'grammar', label: 'Grammar & Mechanics' },
                     { key: 'structure', label: 'Structure & Organization' },
                     { key: 'clarity', label: 'Clarity & Coherence' },
                     { key: 'authenticity', label: 'Authenticity & Voice' },
                     { key: 'story', label: 'Story & Narrative' },
                     { key: 'admissions', label: 'Admissions Impact' }
                   ].map(({ key, label }) => (
                     <div key={key} className="border rounded-lg p-3">
                       <div className="text-sm font-medium text-gray-700">{label}</div>
                       <div className="flex items-center mt-2">
                         <div className={`text-2xl font-bold ${getScoreColor(feedback.feedback.scores[key as keyof typeof feedback.feedback.scores])}`}>
                           {feedback.feedback.scores[key as keyof typeof feedback.feedback.scores]}
                         </div>
                         <div className="ml-2 text-sm text-gray-500">
                           {getScoreLabel(feedback.feedback.scores[key as keyof typeof feedback.feedback.scores])}
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

                             {/* Detailed Feedback */}
               <div className="bg-white rounded-lg shadow-sm p-6">
                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
                 <div className="space-y-4">
                   {[
                     { key: 'grammar', label: 'Grammar & Mechanics' },
                     { key: 'structure', label: 'Structure & Organization' },
                     { key: 'clarity', label: 'Clarity & Coherence' },
                     { key: 'authenticity', label: 'Authenticity & Voice' },
                     { key: 'story', label: 'Story & Narrative' },
                     { key: 'admissions', label: 'Admissions Impact' }
                   ].map(({ key, label }) => (
                     <div key={key} className="border rounded-lg p-4">
                       <h3 className="font-medium text-gray-900 mb-2">{label}</h3>
                       <p className="text-gray-700 text-sm leading-relaxed">
                         {feedback.feedback[key as keyof typeof feedback.feedback] as string}
                       </p>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Action Items */}
               {feedback.feedback.actions && feedback.feedback.actions.length > 0 && (
                 <div className="bg-white rounded-lg shadow-sm p-6">
                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Items</h2>
                   <div className="space-y-2">
                     {feedback.feedback.actions.map((action, index) => (
                       <div key={index} className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                         <p className="text-gray-700 text-sm">{action}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

              {/* Revised Version */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Revised Version</h2>
                  <button
                    onClick={() => setShowRevised(!showRevised)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    {showRevised ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Hide Revision
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-1" />
                        Show Revision
                      </>
                    )}
                  </button>
                </div>
                
                {showRevised && (
                  <div className="prose max-w-none">
                    <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap text-gray-800 leading-relaxed border-l-4 border-blue-500">
                      {feedback.revised}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Rate this feedback</h2>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(rating)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Star className="w-6 h-6 text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
