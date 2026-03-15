"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { AuthModal } from "@/components/AuthModal";
import { buildVotePairs, MOCK_PROJECTS } from "./mockData";
import { Project, VotePair, VoteRecord } from "./types";

type SessionUser = {
  name: string;
  email: string;
  projectId: string | null;
};

type AppState = {
  isAuthed: boolean;
  user: SessionUser | null;
  projects: Project[];
  votePairs: VotePair[];
  voteHistory: VoteRecord[];
  currentPair: VotePair | null;
  authPromptAction: string;
  login: (name: string, email: string) => void;
  logout: () => void;
  openAuthModal: (action?: string) => void;
  closeAuthModal: () => void;
  requireAuth: (action?: string) => boolean;
  createProject: (project: Pick<Project, "name" | "summary" | "owner">) => void;
  joinProjectByCode: (joinCode: string) => { ok: true } | { ok: false; message: string };
  saveProject: (projectId: string, update: Pick<Project, "name" | "summary">) => void;
  castVote: (winnerId: string) => void;
  resetVoting: () => void;
};

const STORAGE_KEY = "hackathon-vote-ui-state-v1";

const AppStateContext = createContext<AppState | null>(null);

function generateJoinCode(name: string) {
  return `${name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase()}${Math.floor(10 + Math.random() * 89)}`;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [votePairs, setVotePairs] = useState<VotePair[]>(buildVotePairs(MOCK_PROJECTS));
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState("continue");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          isAuthed: boolean;
          user: SessionUser | null;
          projects: Project[];
          voteHistory: VoteRecord[];
        };

        const normalizedEmail = parsed.user?.email?.trim().toLowerCase() ?? "";
        const validSession = Boolean(parsed.isAuthed && normalizedEmail);

        setIsAuthed(validSession);
        setUser(
          validSession
            ? {
                name: parsed.user?.name ?? normalizedEmail.split("@")[0] ?? "Hackathon Voter",
                email: normalizedEmail,
                projectId: parsed.user?.projectId ?? null
              }
            : null
        );
        setProjects(parsed.projects?.length ? parsed.projects : MOCK_PROJECTS);
        setVoteHistory(parsed.voteHistory ?? []);
      }
    } catch {
      // ignore bad local state
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    setVotePairs(buildVotePairs(projects));
  }, [projects]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isAuthed, user, projects, voteHistory })
    );
  }, [hydrated, isAuthed, user, projects, voteHistory]);

  const votedPairIds = useMemo(() => new Set(voteHistory.map((vote) => vote.pairId)), [voteHistory]);

  const currentPair = useMemo(() => {
    return votePairs.find((pair) => !votedPairIds.has(pair.id)) ?? null;
  }, [votePairs, votedPairIds]);

  const value: AppState = {
    isAuthed,
    user,
    projects,
    votePairs,
    voteHistory,
    currentPair,
    authPromptAction,
    login: (name, email) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) return;

      setIsAuthed(true);
      setUser((existing) => ({
        name: name.trim() || normalizedEmail.split("@")[0] || "Hackathon Voter",
        email: normalizedEmail,
        projectId: existing?.projectId ?? null
      }));
      setIsAuthModalOpen(false);
    },
    logout: () => {
      setIsAuthed(false);
      setUser(null);
      setVoteHistory([]);
    },
    openAuthModal: (action = "continue") => {
      setAuthPromptAction(action);
      setIsAuthModalOpen(true);
    },
    closeAuthModal: () => setIsAuthModalOpen(false),
    requireAuth: (action = "continue") => {
      const hasValidAuth = Boolean(isAuthed && user?.email);
      if (hasValidAuth) {
        return true;
      }

      // If authentication is not valid, ensure auth states are cleared
      // and the modal is opened.
      if (isAuthed || user?.email) {
        setIsAuthed(false);
        setUser(null);
      }

      setAuthPromptAction(action);
      setIsAuthModalOpen(true);
      return false;
    },
    createProject: ({ name, summary, owner }) => {
      const newProject: Project = {
        id: `proj-${Math.random().toString(36).slice(2, 9)}`,
        name: name.trim(),
        summary: summary.trim(),
        owner: owner.trim(),
        joinCode: generateJoinCode(name)
      };

      setProjects((prev) => [...prev, newProject]);
      setUser((prev) => ({
        name: prev?.name ?? "Hackathon Voter",
        email: prev?.email ?? "",
        projectId: newProject.id
      }));
    },
    joinProjectByCode: (joinCode) => {
      const normalized = joinCode.trim().toUpperCase();
      const project = projects.find((item) => item.joinCode.toUpperCase() === normalized);
      if (!project) {
        return { ok: false, message: "Join code not found. Try again." };
      }

      setUser((prev) => ({
        name: prev?.name ?? "Hackathon Voter",
        email: prev?.email ?? "",
        projectId: project.id
      }));
      return { ok: true };
    },
    saveProject: (projectId, update) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                name: update.name.trim(),
                summary: update.summary.trim()
              }
            : project
        )
      );
    },
    castVote: (winnerId) => {
      if (!currentPair) return;

      const loserId = currentPair.leftProjectId === winnerId ? currentPair.rightProjectId : currentPair.leftProjectId;
      setVoteHistory((prev) => [
        ...prev,
        {
          pairId: currentPair.id,
          winnerId,
          loserId,
          at: new Date().toISOString()
        }
      ]);
    },
    resetVoting: () => setVoteHistory([])
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        actionLabel={authPromptAction}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={value.login}
      />
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return value;
}
