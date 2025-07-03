"use client";
import React, { useEffect, useState } from "react";
// Import the Supabase client we configured
import { supabase } from "../utils/supabase/client";
type TimelineItem = {
  task: string;
  due: string;
};

type EssaySubmission = {
  id: string;
  created_at: string;
  essay: string;
  feedback: string
}

type UserData = {
  year: string;
  applicant_type: string;
  college_type: string;
  goals: string
}
export default function Dashboard() {
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  //tells typescript that timeline will always be an array of objects with the shape
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [timelineId, setTimelineId] = useState(null);

  function downloadTimeline(format: "json" | "text") {
    const filename = `sensei-timeline.${format === "json" ? "json" : "txt"}`;
    let content = "";

    if (format === "json") {
      content = JSON.stringify(timeline, null, 2);
    } else {
      content = timeline
        .map((item, i) => `${i + 1}. ${item.task} (Due: ${item.due})`)
        .join("\n\n");
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const fetchTimeline = async () => {
      const { data, error } = await supabase
        .from("timelines")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Failed to load timeline:", error);
      } else if (data && data.length > 0) {
        setTimeline(data[0].timeline);
        setTimelineId(data[0].id);
      }
    };

    fetchTimeline();
  }, []);

  // Fetch latest user onboarding data
  useEffect(() => {
    // Define an sync function to fetch user data
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Failed to load user data:", error);
      } else {
        console.log(data.length);
        console.log("Fetched user data", data);
        if (data.length > 0) {
          setUserData(data[0]);
        }
      }
    };

    fetchUserData();
  }, []);

  //  Fetch essay submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("essay_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load submissions:", error);
      } else {
        setSubmissions(data);
      }

      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome back 👋</h1>

      {!userData ? (
        <p> Loading your info...</p>
      ) : (
        <>
          <section className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Profile Summary</h2>
            <ul className="text-gray-700 space-y-1">
              <li>
                <strong>Year:</strong> {userData.year}
              </li>
              <li>
                <strong>Applicant Type:</strong> {userData.applicant_type}
              </li>
              <li>
                <strong>Target Colleges:</strong> {userData.college_type}
              </li>
              <li>
                <strong>Goals:</strong> {userData.goals}
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">
              📚 Essay Submission History
            </h2>
            {loading ? (
              <p>Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p>No essays submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {submissions.map((entry) => (
                  <div key={entry.id} className="border-b pb-3">
                    <p className="text-sm text-gray-500">
                      Submitted on:{" "}
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                    <p className="text-gray-800 mt-1">
                      <strong>Essay:</strong> {entry.essay.slice(0, 200)}...
                    </p>
                    <p className="text-gray-600 mt-1">
                      <strong>Feedback:</strong> {entry.feedback.slice(0, 200)}
                      ...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              📅 Your Application Timeline
            </h2>

            {timeline.length === 0 ? (
              <p className="text-gray-500">No timeline generated yet.</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded"
                  >
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={item.due}
                          onChange={(e) => {
                            const newTimeline = [...timeline];
                            newTimeline[idx].due = e.target.value;
                            setTimeline(newTimeline);
                          }}
                          className="border p-1 rounded w-full mb-1 text-sm"
                        />
                        <input
                          type="text"
                          value={item.task}
                          onChange={(e) => {
                            const newTimeline = [...timeline];
                            newTimeline[idx].task = e.target.value;
                            setTimeline(newTimeline);
                          }}
                          className="border p-1 rounded w-full text-sm"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Due: {item.due}</p>
                        <p className="text-gray-800">{item.task}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {timeline.length > 0 && (
              <div className="mt-4 space-x-2">
                {!isEditing ? (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Timeline
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={async () => {
                        if (!timelineId) {
                          console.error("Timeline ID not found");
                          return;
                        }

                        const { error } = await supabase
                          .from("timelines")
                          .update({ timeline })
                          .eq("id", timelineId);

                        if (error) console.error("Save failed:", error);
                        else setIsEditing(false);
                      }}
                    >
                      Save Changes
                    </button>

                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => downloadTimeline("text")}
                    >
                      Download as TXT
                    </button>

                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-2"
                      onClick={() => downloadTimeline("json")}
                    >
                      Download as JSON
                    </button>
                  </>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
