-- Function to update Elo ratings atomically for a vote
create or replace function update_elo_ratings(
  p_winner_id uuid,
  p_winner_new_rating numeric,
  p_loser_id uuid,
  p_loser_new_rating numeric
)
returns void
language plpgsql
as $$
begin
  update public.projects
  set elo_rating = p_winner_new_rating,
      updated_at = now()
  where id = p_winner_id;

  update public.projects
  set elo_rating = p_loser_new_rating,
      updated_at = now()
  where id = p_loser_id;
end;
$$;
