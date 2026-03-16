import { supabase } from "@/lib/supabase";
import { calculateNewEloRatings, getDefaultElo } from "./elo";

/**
 * Get or initialize Elo rating for a project
 */
export async function getProjectElo(projectId: string): Promise<number> {
  const { data, error } = await supabase
    .from("projects")
    .select("elo_rating")
    .eq("id", projectId)
    .single();

  if (error || !data || data.elo_rating === null) {
    // Initialize with default Elo if not set
    return getDefaultElo();
  }

  return data.elo_rating;
}

/**
 * Update Elo ratings for two projects after a vote
 * Winner gets +16, loser gets -16 based on expected score
 */
export async function updateEloAfterVote(
  winnerId: string,
  loserId: string
): Promise<{ winnerNewRating: number; loserNewRating: number } | null> {
  try {
    const [winnerElo, loserElo] = await Promise.all([
      getProjectElo(winnerId),
      getProjectElo(loserId),
    ]);

    const { winnerNewRating, loserNewRating } = calculateNewEloRatings(
      winnerElo,
      loserElo
    );

    // Update both projects in a single transaction
    const { error } = await supabase.rpc("update_elo_ratings", {
      p_winner_id: winnerId,
      p_winner_new_rating: winnerNewRating,
      p_loser_id: loserId,
      p_loser_new_rating: loserNewRating,
    });

    if (error) {
      console.error("Error updating Elo ratings:", error);
      // Fallback to individual updates
      await Promise.all([
        supabase
          .from("projects")
          .update({ elo_rating: winnerNewRating })
          .eq("id", winnerId),
        supabase
          .from("projects")
          .update({ elo_rating: loserNewRating })
          .eq("id", loserId),
      ]);
    }

    return { winnerNewRating, loserNewRating };
  } catch (error) {
    console.error("Error in updateEloAfterVote:", error);
    return null;
  }
}

/**
 * Get all projects sorted by Elo rating (descending)
 */
export async function getProjectsByElo() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("elo_rating", { ascending: false });

  if (error) {
    console.error("Error fetching projects by Elo:", error);
    return [];
  }

  return data;
}
