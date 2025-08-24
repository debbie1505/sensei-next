import { 
  reviewEssayLLM, 
  generateTimelineLLM, 
  matchScholarshipsLLM,
  type EssayMode
} from './provider';
import { type Profile, type EssayReview, type TimelinePlan, type ScholarshipMatch } from './schemas';

export type Tool = 'timeline' | 'essay' | 'match';

export interface RouterInput {
  intent: Tool;
  payload: any;
}

export interface RouterOutput {
  success: boolean;
  data?: any;
  error?: string;
}

export async function route(input: RouterInput): Promise<RouterOutput> {
  try {
    switch (input.intent) {
      case 'timeline':
        const profile: Profile = input.payload;
        const timelinePlan = await generateTimelineLLM(profile);
        return { success: true, data: timelinePlan };
        
      case 'essay':
        const { draft, mode, prompt }: { draft: string; mode: EssayMode; prompt?: string } = input.payload;
        const essayReview = await reviewEssayLLM({ draft, mode, prompt });
        return { success: true, data: essayReview };
        
      case 'match':
        const { profile: matchProfile, tags }: { profile: Profile; tags: string[] } = input.payload;
        const scholarshipMatch = await matchScholarshipsLLM(matchProfile, tags);
        return { success: true, data: scholarshipMatch };
        
      default:
        return { success: false, error: `Unknown tool: ${input.intent}` };
    }
  } catch (error) {
    console.error('Router error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Convenience functions for direct tool access
export async function genTimeline(profile: Profile): Promise<TimelinePlan> {
  const result = await route({ intent: 'timeline', payload: profile });
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function reviewEssay(draft: string, mode: EssayMode, prompt?: string): Promise<EssayReview> {
  const result = await route({ intent: 'essay', payload: { draft, mode, prompt } });
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function findMatches(profile: Profile, tags: string[]): Promise<ScholarshipMatch> {
  const result = await route({ intent: 'match', payload: { profile, tags } });
  if (!result.success) throw new Error(result.error);
  return result.data;
}
