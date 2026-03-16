import { NextRequest, NextResponse } from 'next/server';
import { generateJudgeFeedback } from '@/lib/judge-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, tagline, description, demoUrl, githubUrl } = body;

    // Validate required fields
    if (!projectName || !tagline || !description) {
      return NextResponse.json(
        {
          error: 'Missing required fields: projectName, tagline, description',
        },
        { status: 400 }
      );
    }

    // Generate judge feedback using Vertex AI
    const feedback = await generateJudgeFeedback({
      projectName,
      tagline,
      description,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
    });

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error in judge feedback API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate judge feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
