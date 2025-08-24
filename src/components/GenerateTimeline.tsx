"use client"
import React, { useState, useEffect } from 'react'
import { createClient } from "../utils/supabase/client";


type UserData = {
  grade: number;
  applicant_type: string;
  college_type: string;
  goals: string;
};

type TimelineItem = {
  due: string;
  task: string;
};

export default function GenerateTimeline() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) console.error(error)
      else if (data && data.length > 0) setUserData(data[0])
    }

    fetchUser()
  }, [])

  const handleGenerate = async () => {
    if (!userData) {
      setError("User data not available. Please try again.");
      return;
    }
    
    setLoading(true)
    setError(null)

    const profileSummary = `
      Grade: ${userData.grade}
      Applicant Type: ${userData.applicant_type}
      Target Colleges: ${userData.college_type}
      Goals: ${userData.goals}
    `
   console.log(profileSummary)
    try {
      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileSummary,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate timeline');
      }

      const data = await response.json()
      const timelineData = data.timeline || []

      // Save to Supabase
      const supabase = createClient();
      await supabase.from('plans').insert([
        { profile: profileSummary, timeline: timelineData },
      ])

      setTimeline(timelineData)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    }

    setLoading(false)
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">📆 Personalized Timeline</h1>

      {!userData ? (
        <p>Loading user info...</p>
      ) : (
        <>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 mb-6"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate My Timeline'}
          </button>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {timeline.length > 0 && (
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded shadow border-l-4 border-blue-600"
                >
                  <p className="text-sm text-gray-500 font-medium">
                    Due: {item.due}
                  </p>
                  <p className="text-gray-800">{item.task}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
