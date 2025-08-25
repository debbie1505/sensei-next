// JSON Schemas for OpenAI Structured Outputs

export const EssayReviewSchema = {
  name: "EssayReview",
  schema: {
    type: "object",
    properties: {
      mode: { type: "string", enum: ["light", "standard", "rewrite"] },
      feedback: {
        type: "object",
        properties: {
          grammar: { type: "string", minLength: 1 },
          structure: { type: "string", minLength: 1 },
          clarity: { type: "string", minLength: 1 },
          authenticity: { type: "string", minLength: 1 },
          story: { type: "string", minLength: 1 },
          admissions: { type: "string", minLength: 1 },
          scores: {
            type: "object",
            properties: {
              grammar: { type: "integer", minimum: 1, maximum: 5 },
              structure: { type: "integer", minimum: 1, maximum: 5 },
              clarity: { type: "integer", minimum: 1, maximum: 5 },
              authenticity: { type: "integer", minimum: 1, maximum: 5 },
              story: { type: "integer", minimum: 1, maximum: 5 },
              admissions: { type: "integer", minimum: 1, maximum: 5 }
            },
            required: ["grammar", "structure", "clarity", "authenticity", "story", "admissions"],
            additionalProperties: false
          },
          actions: {
            type: "array",
            items: { type: "string", minLength: 1 },
            maxItems: 10
          }
        },
        required: ["grammar", "structure", "clarity", "authenticity", "story", "admissions"],
        additionalProperties: false
      },
      revised: { type: "string", minLength: 1 }
    },
    required: ["feedback", "revised"],
    additionalProperties: false
  },
  strict: true
};

export const TimelineTaskSchema = {
  name: "TimelineTask",
  schema: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 3 },
      description: { type: "string" },
      due_date: { type: "string", format: "date" },
      start_date: { type: "string", format: "date" },
      category: {
        type: "string",
        enum: ["testing", "essays", "letters", "applications", "financial_aid", "extracurriculars", "interviews", "research", "other"]
      },
      priority: { type: "string", enum: ["low", "medium", "high"] },
      status: { type: "string", enum: ["todo", "doing", "blocked", "done"], default: "todo" },
      school: { type: "string" },
      program: { type: "string" },
      tags: { type: "array", items: { type: "string" }, maxItems: 8 },
      blockers: { type: "array", items: { type: "string" }, maxItems: 8 },
      links: { type: "array", items: { type: "string", format: "uri" }, maxItems: 5 },
      subtasks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1 },
            due_date: { type: "string", format: "date" },
            status: { type: "string", enum: ["todo", "doing", "blocked", "done"], default: "todo" }
          },
          required: ["title"],
          additionalProperties: false
        },
        maxItems: 10
      },
      source: {
        type: "object",
        properties: {
          origin: { type: "string", enum: ["sensei", "user", "import", "school"] },
          rationale: { type: "string" }
        },
        required: ["origin"],
        additionalProperties: false
      }
    },
    required: ["title", "due_date", "category", "priority", "status"],
    additionalProperties: false
  },
  strict: true
};

export const TimelinePlanSchema = {
  name: "TimelinePlan",
  schema: {
    type: "object",
    properties: {
      plan_title: { type: "string" },
      tasks: { 
        type: "array", 
        items: { $ref: "#/$defs/TimelineTask" },
        maxItems: 15
      }
    },
    required: ["tasks"],
    $defs: {
      TimelineTask: TimelineTaskSchema.schema
    }
  },
  strict: true
};

export const ScholarshipMatchSchema = {
  name: "ScholarshipMatch",
  schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
            fit_score: { type: "integer", minimum: 1, maximum: 10 },
            notes: { type: "string" },
            amount: { type: "integer", minimum: 0 },
            deadline: { type: "string", format: "date" },
            eligibility: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          },
          required: ["title", "description", "fit_score"],
          additionalProperties: false
        },
        maxItems: 10
      }
    },
    required: ["items"],
    additionalProperties: false
  },
  strict: true
};

// TypeScript interfaces matching the schemas
export interface EssayReview {
  mode?: "light" | "standard" | "rewrite";
  feedback: {
    grammar: string;
    structure: string;
    clarity: string;
    authenticity: string;
    story: string;
    admissions: string;
    scores: {
      grammar: number;
      structure: number;
      clarity: number;
      authenticity: number;
      story: number;
      admissions: number;
    };
    actions: string[];
  };
  revised: string;
}

export interface TimelineTask {
  title: string;
  description?: string;
  due_date: string;
  start_date?: string;
  category: "testing" | "essays" | "letters" | "applications" | "financial_aid" | "extracurriculars" | "interviews" | "research" | "other";
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "blocked" | "done";
  school?: string;
  program?: string;
  tags?: string[];
  blockers?: string[];
  links?: string[];
  subtasks?: {
    title: string;
    due_date?: string;
    status?: "todo" | "doing" | "blocked" | "done";
  }[];
  source: {
    origin: "sensei" | "user" | "import" | "school";
    rationale?: string;
  };
}

export interface TimelinePlan {
  plan_title?: string;
  tasks: TimelineTask[];
}

export interface ScholarshipMatch {
  items: {
    title: string;
    description: string;
    url?: string;
    fit_score: number;
    notes?: string;
    amount?: number;
    deadline?: string;
    eligibility?: string;
    tags?: string[];
  }[];
}

export interface Profile {
  grade: number;
  state: string;
  citizenship: string;
  gpa: number;
  major_interests: string[];
  applicant_type: string;
  college_type: string;
  goals: string;
}
