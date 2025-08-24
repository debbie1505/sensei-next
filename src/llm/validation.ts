import { z } from 'zod';

// Zod schemas for server-side validation
export const EssayReviewSchema = z.object({
  mode: z.enum(['light', 'standard', 'rewrite']).optional(),
  feedback: z.object({
    grammar: z.string().min(1),
    structure: z.string().min(1),
    clarity: z.string().min(1),
    authenticity: z.string().min(1),
    story: z.string().min(1),
    admissions: z.string().min(1),
    scores: z.object({
      grammar: z.number().min(1).max(5),
      structure: z.number().min(1).max(5),
      clarity: z.number().min(1).max(5),
      authenticity: z.number().min(1).max(5),
      story: z.number().min(1).max(5),
      admissions: z.number().min(1).max(5),
    }),
    actions: z.array(z.string().min(1)).max(10),
  }),
  revised: z.string().min(1),
});

export const TimelineTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.enum(['testing', 'essays', 'letters', 'applications', 'financial_aid', 'extracurriculars', 'interviews', 'research', 'other']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'doing', 'blocked', 'done']).default('todo'),
  school: z.string().optional(),
  program: z.string().optional(),
  tags: z.array(z.string()).max(8).optional(),
  blockers: z.array(z.string()).max(8).optional(),
  links: z.array(z.string().url()).max(5).optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    status: z.enum(['todo', 'doing', 'blocked', 'done']).default('todo'),
  })).max(10).optional(),
  source: z.object({
    origin: z.enum(['sensei', 'user', 'import', 'school']),
    rationale: z.string().optional(),
  }),
});

export const TimelinePlanSchema = z.object({
  plan_title: z.string().optional(),
  tasks: z.array(TimelineTaskSchema).max(15),
});

export const ScholarshipMatchSchema = z.object({
  items: z.array(z.object({
    title: z.string().min(1),
    description: z.string(),
    url: z.string().url().optional(),
    fit_score: z.number().min(1).max(10),
    notes: z.string().optional(),
    amount: z.number().min(0).optional(),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    eligibility: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })).max(10),
});

export const ProfileSchema = z.object({
  grade: z.number().min(8).max(16),
  gpa: z.number().min(0).max(4),
  major_interests: z.array(z.string()),
  state: z.string(),
  citizenship: z.string(),
  applicant_type: z.string(),
  college_type: z.string(),
  goals: z.string(),
});

// Validation functions
export function validateEssayReview(data: unknown) {
  return EssayReviewSchema.parse(data);
}

export function validateTimelinePlan(data: unknown) {
  return TimelinePlanSchema.parse(data);
}

export function validateScholarshipMatch(data: unknown) {
  return ScholarshipMatchSchema.parse(data);
}

export function validateProfile(data: unknown) {
  return ProfileSchema.parse(data);
}

// Type exports
export type ValidatedEssayReview = z.infer<typeof EssayReviewSchema>;
export type ValidatedTimelinePlan = z.infer<typeof TimelinePlanSchema>;
export type ValidatedScholarshipMatch = z.infer<typeof ScholarshipMatchSchema>;
export type ValidatedProfile = z.infer<typeof ProfileSchema>;
