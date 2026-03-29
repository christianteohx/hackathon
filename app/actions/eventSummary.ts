'use server';

export async function generateEventSummary(leaderboard: Array<{
  project_name: string;
  team_name: string;
  votes: number;
}>): Promise<{
  winner: string;
  audience_favorite: string;
  hidden_gem: string;
  recap: string;
}> {
  if (!process.env.VERTEX_AI_PROJECT_ID) {
    return {
      winner: leaderboard[0]?.project_name || 'TBD',
      audience_favorite: leaderboard[1]?.project_name || 'TBD',
      hidden_gem: leaderboard[leaderboard.length - 1]?.project_name || 'TBD',
      recap: 'Summary unavailable — configure Vertex AI to enable.',
    };
  }

  const prompt = `You are an enthusiastic hackathon organizer. Based on the following final leaderboard, write a short, exciting event recap.

Leaderboard:
${leaderboard.map((p, i) => `${i+1}. ${p.project_name} by ${p.team_name} — ${p.votes} votes`).join('\n')}

Respond JSON with exactly:
{
  "winner": "project name",
  "audience_favorite": "project name (2nd place — crowd pleaser)",
  "hidden_gem": "project name (last place but underrated)",
  "recap": "2-3 sentence paragraph celebrating the event"
}`;

  try {
    const { VertexAI } = await import('@google-cloud/vertexai');
    const vertex = new VertexAI({ project: process.env.VERTEX_AI_PROJECT_ID!, location: 'us-central1' });
    const model = vertex.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.find(p => 'text' in p)?.text ?? '';
    // Try to parse JSON from response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    console.error('Vertex AI error:', e);
  }

  return {
    winner: leaderboard[0]?.project_name || 'TBD',
    audience_favorite: leaderboard[1]?.project_name || 'TBD',
    hidden_gem: leaderboard[leaderboard.length - 1]?.project_name || 'TBD',
    recap: 'An amazing hackathon with incredible projects!',
  };
}
