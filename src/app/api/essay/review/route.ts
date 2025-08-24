import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { reviewEssayLLM, type EssayMode } from '@/llm/provider';
import { validateEssayReview } from '@/llm/validation';

export async function POST(request: NextRequest) {
  try {
    const { draft, mode, prompt } = await request.json();
    
    if (!draft || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: draft and mode' },
        { status: 400 }
      );
    }

    // Validate mode
    if (!['light', 'standard', 'rewrite'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be light, standard, or rewrite' },
        { status: 400 }
      );
    }

    // Get user from auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call LLM for feedback using structured outputs
    const feedback = await reviewEssayLLM({ draft, mode: mode as EssayMode, prompt });

    // Validate the response
    const validatedFeedback = validateEssayReview(feedback);

    // Save to database with new structured format
    const { data: essay, error: dbError } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        prompt,
        draft,
        mode,
        feedback: {
          ...validatedFeedback.feedback,
          scores: validatedFeedback.feedback.scores,
          actions: validatedFeedback.feedback.actions
        },
        revised: validatedFeedback.revised
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save essay' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        essay,
        feedback: validatedFeedback
      }
    });

  } catch (error) {
    console.error('Essay review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Streaming version for real-time feedback
export async function PUT(request: NextRequest) {
  const encoder = new TextEncoder();
  
  try {
    const { draft, mode, prompt } = await request.json();
    
    if (!draft || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial status
          controller.enqueue(encoder.encode('data: {"status": "analyzing"}\n\n'));

          // Get feedback from LLM using structured outputs
          const feedback = await reviewEssayLLM({ draft, mode: mode as EssayMode, prompt });

          // Validate the response
          const validatedFeedback = validateEssayReview(feedback);

          // Send feedback
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'complete', feedback: validatedFeedback })}\n\n`));

          // Save to database
          const { error: dbError } = await supabase
            .from('essays')
            .insert({
              user_id: user.id,
              prompt,
              draft,
              mode,
              feedback: {
                ...validatedFeedback.feedback,
                scores: validatedFeedback.feedback.scores,
                actions: validatedFeedback.feedback.actions
              },
              revised: validatedFeedback.revised
            });

          if (dbError) {
            console.error('Database error:', dbError);
            controller.enqueue(encoder.encode('data: {"status": "error", "message": "Failed to save"}\n\n'));
          } else {
            controller.enqueue(encoder.encode('data: {"status": "saved"}\n\n'));
          }

        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: {"status": "error", "message": "Processing failed"}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Streaming setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
