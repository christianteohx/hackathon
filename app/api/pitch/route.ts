import { NextRequest, NextResponse } from 'next/server';
import { generatePitches } from '@/lib/vertex-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { projectName, tagline, description } = body;

    // Validate required fields
    if (!projectName || !tagline || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: projectName, tagline, description' },
        { status: 400 }
      );
    }

    // Generate pitches using Vertex AI
    const pitches = await generatePitches({
      projectName,
      tagline,
      description,
    });

    return NextResponse.json({
      success: true,
      data: pitches,
    });
  } catch (error) {
    console.error('Error in pitch generation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitches', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
