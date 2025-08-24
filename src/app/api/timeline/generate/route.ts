import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateTimelineLLM } from '@/llm/provider';
import { type Profile } from '@/llm/schemas';
import { validateTimelinePlan, validateProfile } from '@/llm/validation';

export async function POST(request: NextRequest) {
  try {
    const profile: Profile = await request.json();
    
    // Validate profile
    const validatedProfile = validateProfile(profile);

    // Get user from auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate timeline using LLM with structured outputs
    const timelinePlan = await generateTimelineLLM(validatedProfile);

    // Validate the timeline plan
    const validatedTimelinePlan = validateTimelinePlan(timelinePlan);

    // Create a new plan
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .insert({
        user_id: user.id,
        title: validatedTimelinePlan.plan_title || 'College Application Timeline',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        meta: { profile }
      })
      .select()
      .single();

    if (planError) {
      console.error('Plan creation error:', planError);
      return NextResponse.json(
        { error: 'Failed to create plan' },
        { status: 500 }
      );
    }

    // Insert tasks with new structured format
    const tasksToInsert = validatedTimelinePlan.tasks.map(task => ({
      plan_id: plan.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      start_date: task.start_date,
      category: task.category,
      priority: task.priority,
      status: task.status,
      school: task.school,
      program: task.program,
      tags: task.tags,
      blockers: task.blockers,
      links: task.links,
      subtasks: task.subtasks,
      source: task.source
    }));

    const { data: insertedTasks, error: tasksError } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (tasksError) {
      console.error('Tasks creation error:', tasksError);
      return NextResponse.json(
        { error: 'Failed to create tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        plan,
        tasks: insertedTasks
      }
    });

  } catch (error) {
    console.error('Timeline generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's plans and tasks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get plans with tasks
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select(`
        *,
        tasks (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (plansError) {
      console.error('Plans fetch error:', plansError);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Timeline fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
