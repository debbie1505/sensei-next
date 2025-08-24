import OpenAI from "openai";
import { 
  EssayReviewSchema, 
  TimelinePlanSchema, 
  ScholarshipMatchSchema,
  type EssayReview,
  type TimelinePlan,
  type ScholarshipMatch,
  type Profile
} from './schemas';

import { env } from "@/env/server";

const openai = new OpenAI({ 
  apiKey: env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY!
});

// Essay Review System Prompt
const ESSAY_REVIEW_SYSTEM_PROMPT = `You are a selective U.S. college admissions essay editor.

Output policy:
- Return ONLY JSON that conforms to the provided JSON Schema (no prose, no markdown).
- Preserve the student's authentic voice; avoid generic corporate tone.
- Be specific and actionable; cite concrete lines/phrases when critiquing.
- Never invent facts. Do not add achievements or claim outcomes.
- Respect mode:
  - light: minor edits; keep structure/content intact.
  - standard: moderate edits; reorganize paragraphs if needed.
  - rewrite: heavy revisions allowed; keep core story + claims.
- Keep 'revised' self-contained and ready to submit after minor polishing.

Rubric definitions:
- grammar: correctness and punctuation.
- structure: logical flow and paragraphing.
- clarity: concise, concrete, easy to follow.
- authenticity: student's voice and reflection.
- story: narrative arc and specificity.
- admissions: fit for selective admissions (impact, growth, reflection).

Return fields: feedback.{grammar,structure,clarity,authenticity,story,admissions, scores{…}, actions[]}, and revised.`;

// Timeline Generation System Prompt
const TIMELINE_SYSTEM_PROMPT = `You are an admissions project manager.

Output policy:
- Return ONLY JSON conforming to the provided JSON Schema (no prose).
- Generate realistic, dated tasks for Fall of 12th grade based on the input profile and deadlines.
- Do not invent deadlines; if a school deadline is missing, infer a conservative internal due_date earlier than typical deadlines and mark source.rationale accordingly.
- Spread work to avoid bunching; earlier tasks unblock later ones.
- Use allowed enums for category/priority/status; due_date/start_date must be YYYY-MM-DD.
- Keep to 8–15 top-level tasks; use subtasks for fine steps.
- Include links ONLY if provided or commonly known official pages (apply links sparingly).

Scheduling rules:
- Personal Statement finalized before first application deadline.
- Supplements per school; stagger drafts and reviews.
- Recommendations: request ≥4 weeks before due dates; send reminders.
- Testing: register/retake only if it can credibly improve.
- Financial aid: FAFSA/CSS tasks with early internal deadlines; include parent info collection.
- Safety/target/reach balance: reflect school list breadth in tasks.

Set source.origin = "sensei" and fill a short source.rationale.`;

// Scholarship Matching System Prompt
const SCHOLARSHIP_SYSTEM_PROMPT = `You are a scholarship matching expert.

Output policy:
- Return ONLY JSON conforming to the provided JSON Schema (no prose).
- Match scholarships based on student profile and provided tags.
- Do not invent scholarships; only suggest real, verifiable opportunities.
- Provide fit_score (1-10) based on eligibility match and student profile.
- Include only scholarships with upcoming deadlines (within 12 months).
- Focus on quality over quantity; prioritize high-fit opportunities.

Fit scoring criteria:
- 9-10: Perfect match for eligibility and interests
- 7-8: Strong match with minor gaps
- 5-6: Moderate match, worth applying
- 3-4: Weak match, only if student is very interested
- 1-2: Poor match, avoid

Return items array with title, description, fit_score, and other available fields.`;

export type EssayMode = 'light' | 'standard' | 'rewrite';

export async function reviewEssayLLM(input: {
  draft: string;
  mode: EssayMode;
  prompt?: string;
}): Promise<EssayReview> {
  const userPrompt = `MODE=${input.mode}
${input.prompt ? `OPTIONAL_CONTEXT=${input.prompt}\n` : ''}
DRAFT:
${input.draft}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: input.mode === "rewrite" ? 0.6 : 0.3,
      messages: [
        { role: "system", content: ESSAY_REVIEW_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: EssayReviewSchema
      }
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result;
  } catch (error) {
    console.error('Essay review error:', error);
    
    // Retry once with temperature 0.0 on JSON parse failure
    if (error instanceof SyntaxError) {
      const retryResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.0,
        messages: [
          { role: "system", content: ESSAY_REVIEW_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: EssayReviewSchema
        }
      });
      
      return JSON.parse(retryResponse.choices[0].message.content!);
    }
    
    throw error;
  }
}

export async function generateTimelineLLM(profile: Profile): Promise<TimelinePlan> {
  const userPrompt = `STUDENT_PROFILE:
- grade: ${profile.grade}
- state: ${profile.state}
- citizenship: ${profile.citizenship}
- gpa/rigor: ${profile.gpa}
- interests: ${profile.major_interests.join(', ')}
- applicant_type: ${profile.applicant_type}
- college_type: ${profile.college_type}
- goals: ${profile.goals}

SCHOOLS (with deadlines if known):
- Add schools based on profile interests and type

OTHER:
- scholarships focus: Based on profile
- extras: Based on goals

Now produce a plan_title and tasks[] for Fall term only (Aug–Dec).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: TIMELINE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: TimelinePlanSchema
      }
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    // Cap tasks at 15 as per schema
    if (result.tasks && result.tasks.length > 15) {
      result.tasks = result.tasks.slice(0, 15);
    }
    
    return result;
  } catch (error) {
    console.error('Timeline generation error:', error);
    
    // Retry once with temperature 0.0 on JSON parse failure
    if (error instanceof SyntaxError) {
      const retryResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.0,
        messages: [
          { role: "system", content: TIMELINE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: TimelinePlanSchema
        }
      });
      
      const result = JSON.parse(retryResponse.choices[0].message.content!);
      
      if (result.tasks && result.tasks.length > 15) {
        result.tasks = result.tasks.slice(0, 15);
      }
      
      return result;
    }
    
    throw error;
  }
}

export async function matchScholarshipsLLM(profile: Profile, tags: string[]): Promise<ScholarshipMatch> {
  const userPrompt = `STUDENT_PROFILE:
- grade: ${profile.grade}
- state: ${profile.state}
- citizenship: ${profile.citizenship}
- gpa: ${profile.gpa}
- interests: ${profile.major_interests.join(', ')}
- applicant_type: ${profile.applicant_type}

TAGS: ${tags.join(', ')}

Find scholarships that match this profile and tags. Focus on high-fit opportunities with upcoming deadlines.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SCHOLARSHIP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: ScholarshipMatchSchema
      }
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    // Cap items at 10 as per schema
    if (result.items && result.items.length > 10) {
      result.items = result.items.slice(0, 10);
    }
    
    return result;
  } catch (error) {
    console.error('Scholarship matching error:', error);
    
    // Retry once with temperature 0.0 on JSON parse failure
    if (error instanceof SyntaxError) {
      const retryResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.0,
        messages: [
          { role: "system", content: SCHOLARSHIP_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: ScholarshipMatchSchema
        }
      });
      
      const result = JSON.parse(retryResponse.choices[0].message.content!);
      
      if (result.items && result.items.length > 10) {
        result.items = result.items.slice(0, 10);
      }
      
      return result;
    }
    
    throw error;
  }
}
