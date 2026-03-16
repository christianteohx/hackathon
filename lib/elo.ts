// Elo Rating Calculation Utilities
const K_FACTOR = 16;
const DEFAULT_ELO = 1200;

/**
 * Calculate expected score for a player based on their rating and opponent's rating
 * @param playerRating - The player's current Elo rating
 * @param opponentRating - The opponent's current Elo rating
 * @returns Expected score (probability of winning) between 0 and 1
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Calculate new Elo ratings after a match
 * @param winnerRating - The winner's current Elo rating
 * @param loserRating - The loser's current Elo rating
 * @returns Object with new ratings for both winner and loser
 */
export function calculateNewEloRatings(winnerRating: number, loserRating: number): {
  winnerNewRating: number;
  loserNewRating: number;
} {
  const expectedScoreWinner = calculateExpectedScore(winnerRating, loserRating);
  const expectedScoreLoser = calculateExpectedScore(loserRating, winnerRating);

  const winnerNewRating = Math.round(winnerRating + K_FACTOR * (1 - expectedScoreWinner));
  const loserNewRating = Math.round(loserRating + K_FACTOR * (0 - expectedScoreLoser));

  return { winnerNewRating, loserNewRating };
}

/**
 * Get the default Elo rating for new projects
 */
export function getDefaultElo(): number {
  return DEFAULT_ELO;
}

/**
 * Get the K-factor used in Elo calculations
 */
export function getKFactor(): number {
  return K_FACTOR;
}
