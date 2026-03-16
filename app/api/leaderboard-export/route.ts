import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Fetch all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name');

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Fetch all votes
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('winner_project_id');

    if (votesError) {
      console.error('Error fetching votes:', votesError);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    // Count votes per project
    const voteCounts = new Map<string, number>();
    votes?.forEach((vote) => {
      const projectId = vote.winner_project_id;
      voteCounts.set(projectId, (voteCounts.get(projectId) || 0) + 1);
    });

    // Build leaderboard data with vote counts
    const teamData = (projects || []).map((project) => ({
      id: project.id,
      name: project.name,
      voteCount: voteCounts.get(project.id) || 0,
    }));

    // Sort by vote count (descending) and assign ranks
    teamData.sort((a, b) => b.voteCount - a.voteCount);

    // Add rank
    const rankedData = teamData.map((team, index) => ({
      rank: index + 1,
      team: team.name,
      votes: team.voteCount,
    }));

    // Convert to CSV
    const csvHeader = 'Rank,Team,Votes\n';
    const csvRows = rankedData
      .map((row) => `${row.rank},"${row.team}",${row.votes}`)
      .join('\n');
    const csvData = csvHeader + csvRows;

    // Return as CSV file
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=leaderboard.csv',
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
