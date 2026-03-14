import { Project, VotePair } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-aurora",
    name: "Aurora Notes",
    summary: "AI meeting notes that auto-build action items in real time.",
    owner: "Team North",
    joinCode: "AURORA24"
  },
  {
    id: "proj-pulse",
    name: "Pulse Grid",
    summary: "Live city transit map with predictive crowd and delay overlays.",
    owner: "Team East",
    joinCode: "PULSE11"
  },
  {
    id: "proj-sprout",
    name: "Sprout Lab",
    summary: "Gamified climate challenges for neighborhoods and schools.",
    owner: "Team Green",
    joinCode: "SPROUT7"
  },
  {
    id: "proj-fjord",
    name: "Fjord Finance",
    summary: "Personal finance coaching with explainable savings suggestions.",
    owner: "Team West",
    joinCode: "FJORD99"
  }
];

export function buildVotePairs(projects: Project[]): VotePair[] {
  const pairs: VotePair[] = [];

  for (let i = 0; i < projects.length; i += 1) {
    for (let j = i + 1; j < projects.length; j += 1) {
      const left = projects[i];
      const right = projects[j];
      pairs.push({
        id: `${left.id}__${right.id}`,
        leftProjectId: left.id,
        rightProjectId: right.id
      });
    }
  }

  return pairs;
}
