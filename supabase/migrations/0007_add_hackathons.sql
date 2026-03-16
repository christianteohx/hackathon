
-- Create the hackathons table
CREATE TABLE public.hackathons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean DEFAULT TRUE,
    created_at timestamp with time zone DEFAULT now()
);

-- Add hackathon_id to projects table
ALTER TABLE public.projects
ADD COLUMN hackathon_id uuid;

-- Add hackathon_id to votes table
ALTER TABLE public.votes
ADD COLUMN hackathon_id uuid;

-- Create a dummy hackathon for existing projects/votes
-- This is a placeholder. In a real scenario, you'd migrate existing data to a specific hackathon.
INSERT INTO public.hackathons (name, slug, description, start_date, end_date, is_active)
VALUES ('Default Hackathon', 'default-hackathon', 'Placeholder for existing projects and votes', '2023-01-01', '2023-12-31', TRUE);

-- Update existing projects and votes to link to the dummy hackathon
UPDATE public.projects
SET hackathon_id = (SELECT id FROM public.hackathons WHERE slug = 'default-hackathon')
WHERE hackathon_id IS NULL; -- Only update projects that don't have a hackathon_id yet

UPDATE public.votes
SET hackathon_id = (SELECT id FROM public.hackathons WHERE slug = 'default-hackathon')
WHERE hackathon_id IS NULL; -- Only update votes that don't have a hackathon_id yet

-- Make hackathon_id NOT NULL after migration
ALTER TABLE public.projects
ALTER COLUMN hackathon_id SET NOT NULL;

ALTER TABLE public.votes
ALTER COLUMN hackathon_id SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE public.projects
ADD CONSTRAINT fk_hackathon_projects
FOREIGN KEY (hackathon_id) REFERENCES public.hackathons(id) ON DELETE CASCADE;

ALTER TABLE public.votes
ADD CONSTRAINT fk_hackathon_votes
FOREIGN KEY (hackathon_id) REFERENCES public.hackathons(id) ON DELETE CASCADE;

-- Enable RLS for new tables and existing tables
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hackathons table
CREATE POLICY "Enable read access for all users" ON public.hackathons FOR SELECT USING (true);

-- RLS Policies for projects table
-- Users can view projects associated with any hackathon
CREATE POLICY "Enable read access for all users on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert projects for active hackathon" ON public.projects
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.hackathons WHERE id = hackathon_id AND is_active = TRUE));
CREATE POLICY "Allow owners to update their projects" ON public.projects
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); -- Assuming user_id column exists

-- RLS Policies for votes table
-- Users can view votes associated with any hackathon
CREATE POLICY "Enable read access for all users on votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert votes for active hackathon" ON public.votes
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.hackathons WHERE id = hackathon_id AND is_active = TRUE));
CREATE POLICY "Allow owners to update/delete their votes" ON public.votes
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); -- Assuming user_id column exists
