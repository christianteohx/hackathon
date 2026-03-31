import type { Metadata } from 'next';
import ProjectDetailClient from './ProjectDetailClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data: project } = await supabase
    .from('projects')
    .select('name, tagline')
    .eq('id', id)
    .maybeSingle();

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = `${project.name} • Hackathon Platform`;
  const description = project.tagline || 'See this project on the live leaderboard';
  const ogImageUrl = `/api/og/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}
