export type Project = {
  id: string;
  name: string;
  summary: string;
  owner: string;
  joinCode: string;
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
