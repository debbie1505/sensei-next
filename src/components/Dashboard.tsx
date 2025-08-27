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
  start_date?: string;
  status?: string;
  priority?: string;
  category?: string;
  plan_id?: string;
  description?: string;
  notes?: string;
  school?: string;
  program?: string;
  tags?: string[];
  blockers?: string[];
  links?: string[];
  subtasks?: any;
  source?: any;
  created_at?: string;
  updated_at?: string;
};

type EssaySubmission = {
  id: string;
  created_at: string;
  draft: string;
  feedback: any;
  prompt?: string;
  mode?: string;
}

type UserData = {
  user_id: string;
  grade: number;
  gpa?: number;
  major_interests?: string[];
  state?: string;
  citizenship?: string;
  applicant_type?: string;
  college_type?: string;
  goals?: string;
  created_at?: string;
  updated_at?: string;
}

// src/components/Dashboard.tsx
function logPgErr(prefix: string, err: unknown) {
  const e: any = err;
  console.error(prefix, {
    type: e?.name ?? e?.constructor?.name,
    status: e?.status ?? null,      // AuthApiError has status
    code: e?.code ?? null,          // PostgrestError has code
    message: e?.message ?? null,
    details: e?.details ?? null,
    hint: e?.hint ?? null,
  });
}


export default function Dashboard() {
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [timelineId, setTimelineId] = useState<string | null>(null);

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


// Remove this old timeline fetch - we have a better one below


  // Fetch latest user onboarding data
  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
    
        // require a session
        const { data: { session }, error: sErr } = await supabase.auth.getSession();
        if (sErr || !session?.user) {
          logPgErr("No session", sErr);
          return;
        }
        const uid = session.user.id;
    
        // First, try to get the latest plan
        const { data: plan, error: planErr } = await supabase
          .from("plans")
          .select("id, title")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .maybeSingle();
    
        if (planErr) {
          logPgErr("Plan select failed", planErr);
          return;
        }
    
        if (plan) {
          setTimelineId(plan.id);
          
          // Then fetch tasks for this plan
          const { data: tasks, error: tasksErr } = await supabase
            .from("tasks")
            .select("*")
            .eq("plan_id", plan.id)
            .order("due_date", { ascending: true });
      
          if (tasksErr) {
            logPgErr("Tasks select failed", tasksErr);
            setTimeline([]);
          } else {
            setTimeline(tasks || []);
          }
          return;
        }
    
        // none found → create one
        const { data: created, error: insErr } = await supabase
          .from("plans")
          .insert({ 
            user_id: uid,
            title: "My Application Timeline"
          })
          .select("id")
          .single();
    
        if (insErr) {
          logPgErr("Timeline create failed", insErr);
          return;
        }
    
        setTimelineId(created.id);
        setTimeline([]); // empty until user adds tasks
      } catch (err) {
        console.error("Timeline fetch error:", err);
        setTimeline([]);
      }
    };
  
    run();
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
    
        if (error) {
          logPgErr("Load profile failed", error);
          setUserData(null);
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setUserData(null);
      }
    };
    run();
  }, []);

  //  Fetch essay submissions
  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
  
      const { data, error } = await supabase
        .from("essay_submissions")            // <-- not "essays"
        .select("id, created_at, draft, feedback") // adjust columns if yours differ
        .eq("user_id", session.user.id)       // owner scope
        .order("created_at", { ascending: false });
  
      if (error) {
        logPgErr("Load submissions failed", error);
      } else {
        setSubmissions(data ?? []);
      }
      setLoading(false);
    };
    run();
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
                    <span className="font-medium">{userData.applicant_type || 'Not specified'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Colleges:</span>
                    <span className="font-medium">{userData.college_type || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goals:</span>
                    <span className="font-medium">{userData.goals || 'Not specified'}</span>
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
                        <strong>Essay:</strong> {entry.draft.slice(0, 150)}...
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Feedback:</strong> {typeof entry.feedback === 'string' ? entry.feedback.slice(0, 100) : JSON.stringify(entry.feedback).slice(0, 100)}...
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
                            // SAVE CHANGES button onClick (replace the whole body)
onClick={async () => {
  if (!timelineId) { console.error("Timeline ID not found"); return; }

  try {
    const supabase = createClient();
    
    // For now, we'll just update the plan's meta field with the timeline data
    // In a real implementation, you'd want to update individual tasks
    const { error } = await supabase
      .from("plans")
      .update({ meta: { tasks: timeline } })
      .eq("id", timelineId)
      .select("id")
      .single();

    if (error) {
      logPgErr("Save timeline failed", error);
    } else {
      setIsEditing(false);
    }
  } catch (err) {
    console.error("Save timeline error:", err);
  }
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
