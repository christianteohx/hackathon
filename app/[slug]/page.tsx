import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function HackathonPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: hackathon, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !hackathon) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{hackathon.name}</h1>
      <p className="text-lg mb-4">{hackathon.description}</p>
      <p className="text-gray-600 mb-2">Start Date: {new Date(hackathon.start_date).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-4">End Date: {new Date(hackathon.end_date).toLocaleDateString()}</p>

      <div className="flex space-x-4">
        <Link href={`/leaderboard?hackathon=${hackathon.slug}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Leaderboard
        </Link>
        <Link href={`/vote?hackathon=${hackathon.slug}`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Vote
        </Link>
      </div>
    </div>
  );
}
