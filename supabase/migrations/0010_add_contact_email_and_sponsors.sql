-- Add contact_email field to hackathons table
ALTER TABLE public.hackathons
ADD COLUMN IF NOT EXISTS contact_email text;

-- Also add sponsor logos column (JSON array of {name, logo_url})
ALTER TABLE public.hackathons
ADD COLUMN IF NOT EXISTS sponsor_logos jsonb DEFAULT '[]'::jsonb;

-- Update the dummy hackathon with a sample contact email
UPDATE public.hackathons
SET contact_email = ' organizers@example.com'
WHERE slug = 'default-hackathon';

-- Add RLS policy for contact_email (public read is fine for organizers who want contact)
-- The contact_email is intentionally public so voters can reach organizers
