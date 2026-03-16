export type Project = { 
  id: string; 
  name: string; 
  description?: string; // Maps to summary in some parts of the app
  summary?: string; // Alias for description, used in UI
  tagline?: string; 
  owner?: string; // Derived from user, not in DB directly
  joinCode: string; // Maps to join_code in DB
  created_by_user_id?: string; // The user ID of the project creator
  demo_url?: string | null; 
  github_url?: string | null; 
  created_at?: string; 
  updated_at?: string; 
  elo_rating?: number; // Elo rating for voting system
}; 

export type VotePair = { 
  id: string; 
  leftProjectId: string; 
  rightProjectId: string; 
}; 

export type VoteRecord = { 
  pairId: string; 
  winnerId: string; 
  loserId: string; 
  at: string; 
}; 
