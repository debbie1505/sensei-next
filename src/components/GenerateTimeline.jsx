"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from "../utils/supabase/client";

export default function GenerateTimeline() {
  const [userData, setUserData] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) console.error(error)
      else if (data && data.length > 0) setUserData(data[0])
    }

    fetchUser()
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    const profileSummary = `
      Year: ${userData.year}
      Applicant Type: ${userData.applicant_type}
      Target Colleges: ${userData.college_type}
      Goals: ${userData.goals}
    `
   console.log(profileSummary)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a college counselor helping students create personalized application timelines.',
            },
            {
              role: 'user',
              content: `Based on this profile:\n${profileSummary}\n
              Return a JSON array of 6-10 steps like:
              [{"due": "August 15, 2025", "task": "Finalize college essay draft"}, …].
              Only return the JSON. No explanation.`,
            },
          ],
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content?.trim()

      let timelineData = []
      try {
        timelineData = JSON.parse(content)
      } catch (err) {
        console.error("Failed to parse JSON:", err)
        setError("Timeline generation failed. Try again.")
        setLoading(false)
        return
      }

      // Save to Supabase
      await supabase.from('timelines').insert([
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
