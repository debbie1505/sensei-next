"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import Link from "next/link";
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  Plus, 
  Download,
  Edit3,
  CheckCircle,
  DollarSign
} from "lucide-react";

type TimelineItem = {
  id: string;
  title: string;
  due_date: string;
  status: string;
  priority: string;
  category: string;
};

type EssaySubmission = {
  id: string;
  created_at: string;
  essay: string;
  feedback: string
}

type UserData = {
  grade: number;
  applicant_type: string;
  college_type: string;
  goals: string
}

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
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
        .map((item, i) => `${i + 1}. ${item.title} (Due: ${item.due_date})`)
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from("plans")
        .select(`
          *,
          tasks (*)
        `)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Failed to load timeline:", error);
      } else if (data && data.length > 0) {
        setTimeline(data[0].tasks || []);
        setTimelineId(data[0].id);
      }
    };

    fetchTimeline();
  }, []);

  // Fetch latest user onboarding data
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from("essays")
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
          <p className="text-gray-600">Here&apos;s your college application progress</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link 
            href="/essay" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Essay Review</h3>
            </div>
            <p className="text-gray-600 text-sm">Get AI feedback on your college essays</p>
          </Link>

          <Link 
            href="/timeline" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Timeline</h3>
            </div>
            <p className="text-gray-600 text-sm">Generate your application timeline</p>
          </Link>

          <Link 
            href="/scholarships" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Scholarships</h3>
            </div>
            <p className="text-gray-600 text-sm">Find matching scholarships</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-3">
              <User className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Profile</h3>
            </div>
            <p className="text-gray-600 text-sm">Manage your application profile</p>
          </div>
        </div>

        {!userData ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Summary */}
            <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Your Profile Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium">{userData.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applicant Type:</span>
                    <span className="font-medium">{userData.applicant_type}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Colleges:</span>
                    <span className="font-medium">{userData.college_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goals:</span>
                    <span className="font-medium">{userData.goals}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Essay Submissions */}
            <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Essay Submissions</h2>
                </div>
                <Link 
                  href="/essay"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Review
                </Link>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-gray-600">Loading submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No essays submitted yet</p>
                  <Link 
                    href="/essay"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Your First Essay
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-gray-800 mb-2">
                        <strong>Essay:</strong> {entry.essay.slice(0, 150)}...
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Feedback:</strong> {entry.feedback.slice(0, 100)}...
                      </p>
                    </div>
                  ))}
                  {submissions.length > 3 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-500">And {submissions.length - 3} more submissions</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Application Timeline</h2>
                </div>
                {timeline.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => downloadTimeline("text")}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </button>
                  </div>
                )}
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No timeline generated yet</p>
                  <Link 
                    href="/timeline"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Timeline
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-green-600 pl-4 py-3 bg-gray-50 rounded-r-lg"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.due_date}
                            onChange={(e) => {
                              const newTimeline = [...timeline];
                              newTimeline[idx].due_date = e.target.value;
                              setTimeline(newTimeline);
                            }}
                            className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newTimeline = [...timeline];
                              newTimeline[idx].title = e.target.value;
                              setTimeline(newTimeline);
                            }}
                            className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 font-medium">Due: {item.due_date}</p>
                          <p className="text-gray-800">{item.title}</p>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {timeline.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-500">And {timeline.length - 5} more tasks</p>
                    </div>
                  )}
                  
                  {timeline.length > 0 && (
                    <div className="mt-6 flex space-x-2">
                      {!isEditing ? (
                        <button
                          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Timeline
                        </button>
                      ) : (
                        <>
                          <button
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            onClick={async () => {
                              if (!timelineId) {
                                console.error("Timeline ID not found");
                                return;
                              }

                                                                                    const supabase = createClient();
                              const { error } = await supabase
                          .from("tasks")
                          .upsert(timeline.map(task => ({ ...task, plan_id: timelineId })));

                              if (error) console.error("Save failed:", error);
                              else setIsEditing(false);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>

                          <button
                            className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
