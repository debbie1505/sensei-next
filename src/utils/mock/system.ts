"use client";

import { MockRole } from "./auth";

export type ApplicationStatus = "not_started" | "in_progress" | "submitted" | "withdrawn";
export type RequirementStatus = "not_started" | "in_progress" | "requested" | "submitted";
export type RecommendationStatus = "not_requested" | "requested" | "submitted" | "declined";
export type TaskStatus = "todo" | "doing" | "done" | "blocked";

export type MockCollege = {
  id: string;
  schoolName: string;
  deadline: string;
  status: ApplicationStatus;
  progress: number;
  applicationRound: string;
};

export type MockRequirement = {
  id: string;
  collegeId: string;
  type: "essay" | "recommendation_letter" | "transcript" | "test_score" | "portfolio" | "other";
  title: string;
  status: RequirementStatus;
  dueDate: string;
};

export type MockTask = {
  id: string;
  title: string;
  dueDate: string;
  weekLabel: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  category: string;
  collegeId?: string;
  requirementId?: string;
  essayId?: string;
  reminderState?: "none" | "due_soon" | "behind" | "overdue";
};

export type MockEssayVersion = {
  id: string;
  versionNumber: number;
  draft: string;
  createdAt: string;
};

export type MockComment = {
  id: string;
  commenterRole: "student" | "counselor" | "key_person" | "mentor";
  commenterName: string;
  comment: string;
  targetText?: string;
  status: "pending" | "resolved" | "ignored";
  createdAt: string;
};

export type MockEssay = {
  id: string;
  collegeId: string;
  prompt: string;
  wordTarget: number;
  deadline: string;
  currentDraft: string;
  feedbackSummary: string;
  versions: MockEssayVersion[];
  comments: MockComment[];
};

export type MockRecommender = {
  id: string;
  name: string;
  email: string;
  relationship: string;
};

export type MockRecommendationRequest = {
  id: string;
  collegeId: string;
  recommenderId: string;
  requestedDate: string;
  dueDate: string;
  status: RecommendationStatus;
};

export type MockNudge = {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
};

export type MockStudentSystem = {
  studentId: string;
  studentName: string;
  colleges: MockCollege[];
  requirements: MockRequirement[];
  timelineTasks: MockTask[];
  essays: MockEssay[];
  recommenders: MockRecommender[];
  recommendationRequests: MockRecommendationRequest[];
  aiNudges: MockNudge[];
};

type MockSystemStore = {
  students: Record<string, MockStudentSystem>;
  counselorView: {
    counselorId: string;
    studentIds: string[];
  };
  teacherView: {
    teacherId: string;
    studentIds: string[];
  };
};

const STORAGE_KEY = "admitra.mock.system.v1";
export const DEFAULT_STUDENT_ID = "00000000-0000-0000-0000-000000000101";
export const DEFAULT_COUNSELOR_ID = "00000000-0000-0000-0000-000000000102";
export const DEFAULT_TEACHER_ID = "00000000-0000-0000-0000-000000000103";

function addDays(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

const initialStudentSystem: MockStudentSystem = {
  studentId: DEFAULT_STUDENT_ID,
  studentName: "Student Demo",
  colleges: [
    {
      id: "college-stanford",
      schoolName: "Stanford University",
      deadline: addDays(21),
      status: "in_progress",
      progress: 62,
      applicationRound: "Regular Decision",
    },
    {
      id: "college-ucla",
      schoolName: "UCLA",
      deadline: addDays(14),
      status: "in_progress",
      progress: 48,
      applicationRound: "Regular Decision",
    },
    {
      id: "college-mit",
      schoolName: "MIT",
      deadline: addDays(30),
      status: "not_started",
      progress: 12,
      applicationRound: "Regular Decision",
    },
  ],
  requirements: [
    { id: "req-1", collegeId: "college-stanford", type: "essay", title: "Personal Statement", status: "in_progress", dueDate: addDays(12) },
    { id: "req-2", collegeId: "college-stanford", type: "recommendation_letter", title: "Counselor Recommendation", status: "requested", dueDate: addDays(10) },
    { id: "req-3", collegeId: "college-ucla", type: "transcript", title: "Official Transcript", status: "requested", dueDate: addDays(9) },
    { id: "req-4", collegeId: "college-ucla", type: "essay", title: "UCLA Supplemental Essay", status: "not_started", dueDate: addDays(8) },
    { id: "req-5", collegeId: "college-mit", type: "test_score", title: "SAT Score Send", status: "not_started", dueDate: addDays(25) },
  ],
  timelineTasks: [
    { id: "task-1", title: "Draft Stanford personal statement v2", dueDate: addDays(3), weekLabel: "This Week", status: "doing", priority: "high", category: "essays", collegeId: "college-stanford", requirementId: "req-1", reminderState: "behind" },
    { id: "task-2", title: "Follow up with counselor on recommendation", dueDate: addDays(2), weekLabel: "This Week", status: "todo", priority: "high", category: "letters", collegeId: "college-stanford", requirementId: "req-2", reminderState: "due_soon" },
    { id: "task-3", title: "Submit transcript request to registrar", dueDate: addDays(1), weekLabel: "This Week", status: "todo", priority: "medium", category: "applications", collegeId: "college-ucla", requirementId: "req-3", reminderState: "due_soon" },
    { id: "task-4", title: "Outline UCLA supplemental response", dueDate: addDays(7), weekLabel: "Next Week", status: "todo", priority: "medium", category: "essays", collegeId: "college-ucla", requirementId: "req-4", reminderState: "none" },
    { id: "task-5", title: "Finalize MIT activity list", dueDate: addDays(10), weekLabel: "Next Week", status: "todo", priority: "low", category: "applications", collegeId: "college-mit", reminderState: "none" },
  ],
  essays: [
    {
      id: "essay-1",
      collegeId: "college-stanford",
      prompt: "Tell us about something meaningful to you and why.",
      wordTarget: 650,
      deadline: addDays(12),
      currentDraft:
        "When I was fourteen, I built a tiny tutoring group for students who were struggling with algebra. It started with one classmate and became a weekly routine...",
      feedbackSummary: "Strong narrative voice; tighten transitions and add clearer reflection in final paragraph.",
      versions: [
        { id: "v1", versionNumber: 1, draft: "First rough narrative draft...", createdAt: addDays(-5) },
        { id: "v2", versionNumber: 2, draft: "Second draft with revised intro...", createdAt: addDays(-2) },
      ],
      comments: [
        {
          id: "comment-1",
          commenterRole: "counselor",
          commenterName: "Counselor Demo",
          comment: "Great opening. Can you connect this story to why this matters for your college goals?",
          targetText: "When I was fourteen...",
          status: "pending",
          createdAt: addDays(-1),
        },
        {
          id: "comment-2",
          commenterRole: "key_person",
          commenterName: "Teacher Demo",
          comment: "Sentence flow is cleaner now. Consider cutting 40 words in paragraph two.",
          status: "resolved",
          createdAt: addDays(-1),
        },
      ],
    },
  ],
  recommenders: [
    { id: "rec-1", name: "Mr. Jordan Lee", email: "jlee@school.edu", relationship: "AP English Teacher" },
    { id: "rec-2", name: "Ms. Priya Singh", email: "psingh@school.edu", relationship: "Counselor" },
  ],
  recommendationRequests: [
    { id: "rr-1", collegeId: "college-stanford", recommenderId: "rec-1", requestedDate: addDays(-10), dueDate: addDays(10), status: "requested" },
    { id: "rr-2", collegeId: "college-ucla", recommenderId: "rec-2", requestedDate: addDays(-4), dueDate: addDays(9), status: "requested" },
  ],
  aiNudges: [
    { id: "nudge-1", severity: "critical", message: "You are behind on Stanford supplements due in 12 days. Prioritize essay draft today." },
    { id: "nudge-2", severity: "warning", message: "Two recommendation requests are still pending confirmation." },
  ],
};

function initialStore(): MockSystemStore {
  return {
    students: {
      [DEFAULT_STUDENT_ID]: initialStudentSystem,
    },
    counselorView: {
      counselorId: DEFAULT_COUNSELOR_ID,
      studentIds: [DEFAULT_STUDENT_ID],
    },
    teacherView: {
      teacherId: DEFAULT_TEACHER_ID,
      studentIds: [DEFAULT_STUDENT_ID],
    },
  };
}

export function getMockSystemStore(): MockSystemStore {
  if (typeof window === "undefined") return initialStore();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = initialStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as MockSystemStore;
  } catch {
    const seed = initialStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveMockSystemStore(store: MockSystemStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getStudentSystem(studentId = DEFAULT_STUDENT_ID): MockStudentSystem {
  const store = getMockSystemStore();
  return store.students[studentId] ?? initialStudentSystem;
}

export function updateStudentSystem(student: MockStudentSystem) {
  const store = getMockSystemStore();
  store.students[student.studentId] = student;
  saveMockSystemStore(store);
}

export function markTaskStatus(studentId: string, taskId: string, status: TaskStatus) {
  const student = getStudentSystem(studentId);
  student.timelineTasks = student.timelineTasks.map((task) => (task.id === taskId ? { ...task, status } : task));
  student.colleges = recalcCollegeProgress(student);
  updateStudentSystem(student);
}

export function updateRequirementStatus(studentId: string, requirementId: string, status: RequirementStatus) {
  const student = getStudentSystem(studentId);
  student.requirements = student.requirements.map((req) => (req.id === requirementId ? { ...req, status } : req));
  student.colleges = recalcCollegeProgress(student);
  updateStudentSystem(student);
}

export function addEssayVersion(studentId: string, essayId: string, draft: string) {
  const student = getStudentSystem(studentId);
  student.essays = student.essays.map((essay) => {
    if (essay.id !== essayId) return essay;
    const nextVersion = essay.versions.length + 1;
    return {
      ...essay,
      currentDraft: draft,
      versions: [
        ...essay.versions,
        {
          id: `v-${essayId}-${nextVersion}`,
          versionNumber: nextVersion,
          draft,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });
  updateStudentSystem(student);
}

export function addEssayComment(
  studentId: string,
  essayId: string,
  comment: Omit<MockComment, "id" | "createdAt" | "status">
) {
  const student = getStudentSystem(studentId);
  student.essays = student.essays.map((essay) => {
    if (essay.id !== essayId) return essay;
    return {
      ...essay,
      comments: [
        ...essay.comments,
        {
          id: `comment-${Math.random().toString(36).slice(2, 10)}`,
          createdAt: new Date().toISOString(),
          status: "pending",
          ...comment,
        },
      ],
    };
  });
  updateStudentSystem(student);
}

export function updateCommentStatus(
  studentId: string,
  essayId: string,
  commentId: string,
  status: "pending" | "resolved" | "ignored"
) {
  const student = getStudentSystem(studentId);
  student.essays = student.essays.map((essay) => {
    if (essay.id !== essayId) return essay;
    return {
      ...essay,
      comments: essay.comments.map((comment) =>
        comment.id === commentId ? { ...comment, status } : comment
      ),
    };
  });
  updateStudentSystem(student);
}

export function addManualTask(studentId: string, task: Omit<MockTask, "id">) {
  const student = getStudentSystem(studentId);
  student.timelineTasks = [
    ...student.timelineTasks,
    {
      ...task,
      id: `task-${Math.random().toString(36).slice(2, 10)}`,
    },
  ];
  updateStudentSystem(student);
}

export function updateRecommendationRequestStatus(
  studentId: string,
  requestId: string,
  status: RecommendationStatus
) {
  const student = getStudentSystem(studentId);
  student.recommendationRequests = student.recommendationRequests.map((request) =>
    request.id === requestId ? { ...request, status } : request
  );
  updateStudentSystem(student);
}

export function generateWeeklyPlan(studentId: string) {
  const student = getStudentSystem(studentId);
  const now = new Date();
  const generated: MockTask[] = student.requirements
    .filter((req) => req.status !== "submitted")
    .slice(0, 6)
    .map((req, index) => {
      const due = new Date();
      due.setDate(now.getDate() + (index + 1) * 3);
      return {
        id: `gen-${Math.random().toString(36).slice(2, 10)}`,
        title: `Complete ${req.title}`,
        dueDate: due.toISOString().slice(0, 10),
        weekLabel: index < 3 ? "This Week" : "Next Week",
        status: "todo",
        priority: index < 2 ? "high" : "medium",
        category: req.type === "essay" ? "essays" : "applications",
        collegeId: req.collegeId,
        requirementId: req.id,
        reminderState: index < 2 ? "due_soon" : "none",
      };
    });
  student.timelineTasks = [...generated, ...student.timelineTasks].slice(0, 20);
  student.aiNudges = [
    {
      id: `nudge-${Math.random().toString(36).slice(2, 8)}`,
      severity: "warning",
      message: "Timeline auto-adjusted based on outstanding requirements. Focus on the top 2 high-priority tasks this week.",
    },
    ...student.aiNudges,
  ].slice(0, 5);
  updateStudentSystem(student);
}

function recalcCollegeProgress(student: MockStudentSystem): MockCollege[] {
  return student.colleges.map((college) => {
    const reqs = student.requirements.filter((req) => req.collegeId === college.id);
    const submitted = reqs.filter((req) => req.status === "submitted").length;
    const inProgress = reqs.filter((req) => req.status === "in_progress" || req.status === "requested").length;
    const total = Math.max(reqs.length, 1);
    const progress = Math.min(100, Math.round(((submitted + inProgress * 0.5) / total) * 100));
    const status: ApplicationStatus =
      progress >= 95 ? "submitted" : progress > 0 ? "in_progress" : "not_started";
    return {
      ...college,
      status,
      progress,
    };
  });
}

export function getStudentsForRole(role: MockRole) {
  const store = getMockSystemStore();
  if (role === "counselor") {
    return store.counselorView.studentIds.map((id) => store.students[id]).filter(Boolean);
  }
  if (role === "key_person") {
    return store.teacherView.studentIds.map((id) => store.students[id]).filter(Boolean);
  }
  return [];
}

export function exportApplicationPackage(studentId: string) {
  const student = getStudentSystem(studentId);
  return {
    exportedAt: new Date().toISOString(),
    studentName: student.studentName,
    colleges: student.colleges,
    requirements: student.requirements,
    essays: student.essays.map((essay) => ({
      id: essay.id,
      collegeId: essay.collegeId,
      prompt: essay.prompt,
      draft: essay.currentDraft,
      versions: essay.versions,
      comments: essay.comments,
    })),
    recommendationRequests: student.recommendationRequests,
    timelineTasks: student.timelineTasks,
  };
}

