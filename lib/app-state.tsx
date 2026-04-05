// @ts-nocheck
"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { buildVotePairs, MOCK_PROJECTS } from "./mockData";
import { Project, VotePair, VoteRecord } from "./types";
import { supabase } from "@/lib/supabase";
import { updateEloAfterVote } from "./elo-service";

type SessionUser = {
  id: string;
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
  castVote: (winnerId: string, anonymous?: boolean) => void;
  resetVoting: () => void;
  isBlindMode: boolean;
  toggleBlindMode: () => void;
  setBlindMode: (enabled: boolean) => void;
  isAnonymousMode: boolean;
  toggleAnonymousMode: () => void;
  setAnonymousMode: (enabled: boolean) => void;
};

const AppStateContext = createContext<AppState | null>(null);

function generateJoinCode(name: string) {
  return `${name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase()}${Math.floor(10 + Math.random() * 89)}`;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [votePairs, setVotePairs] = useState<VotePair[]>([]);
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState("continue");
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [activeHackathonId, setActiveHackathonId] = useState<string | null>(null);
  // Session-level localStorage tracking of voted pair IDs (covers both DB failures and repeat votes)
  const [localVotedPairIds, setLocalVotedPairIds] = useState<Set<string>>(new Set());

  // Load voted pairs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hackathon_voted_pairs");
      if (stored) {
        setLocalVotedPairIds(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      let currentUserId: string | null = null;
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setIsAuthed(false);
        setUser(null);
      } else if (session) {
        currentUserId = session.user.id;
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name, project_id")
          .eq("id", session.user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsAuthed(false);
          setUser(null);
        } else if (profile) {
          setIsAuthed(true);
          setUser({
            id: session.user.id,
            name: profile.name || session.user.email?.split("@")[0] || "Hackathon Voter",
            email: session.user.email!,
            projectId: profile.project_id,
          });
        }
      }

      const { data: activeHackathon } = await (supabase as any)
        .from("hackathons")
        .select("id")
        .eq("is_active", true)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      setActiveHackathonId(activeHackathon?.id ?? null);

      const { data: fetchedProjects, error: projectsError } = await supabase
 .from("projects")
 .select("*");
 if (projectsError) {
 console.error("Error fetching projects:", projectsError);
 console.log("Falling back to mock projects data due to error");
 setProjects(MOCK_PROJECTS);
 } else if (fetchedProjects && fetchedProjects.length > 0) {
 const mappedProjects = (fetchedProjects || []).map((p) => ({
 ...p,
 summary: p.description,
          owner: p.team_name || null,
 joinCode: p.join_code,
 elo_rating: p.elo_rating ?? 1200,
 is_featured: p.is_featured ?? false,
 }));
 setProjects(mappedProjects as Project[]);
 } else {
 console.log("No projects in database, falling back to mock projects data");
 setProjects(MOCK_PROJECTS);
 }

      let votesQuery = supabase
        .from("votes")
        .select("*");

      if (currentUserId) {
        votesQuery = votesQuery.or(`session_id.eq.${currentUserId},created_by_user_id.eq.${currentUserId}`);
      } else {
        // Anonymous browser-only mode falls back to localStorage dedupe.
        votesQuery = votesQuery.limit(0);
      }

      const { data: fetchedVotes, error: votesError } = await votesQuery;
      if (votesError) {
        console.error("Error fetching votes:", votesError);
        setVoteHistory([]);
      } else {
        const mappedVotes = (fetchedVotes || []).map((vote) => ({
          ...vote,
          pairId: `${vote.left_project_id}__${vote.right_project_id}`,
          winnerId: vote.winner_project_id,
          loserId: vote.winner_project_id === vote.left_project_id
            ? vote.right_project_id
            : vote.left_project_id,
          at: vote.created_at,
        }));
        setVoteHistory(mappedVotes);
      }

    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setVotePairs(buildVotePairs(projects));
  }, [projects]);

  const votedPairIds = useMemo(
    () => new Set(voteHistory.map((vote) => vote.pairId)),
    [voteHistory]
  );

  // Combine Supabase vote history with session localStorage pairs
  const allVotedPairIds = useMemo(() => {
    return new Set([...votedPairIds, ...localVotedPairIds]);
  }, [votedPairIds, localVotedPairIds]);

  const currentPair = useMemo(() => {
    return votePairs.find((pair) => !allVotedPairIds.has(pair.id)) ?? null;
  }, [votePairs, allVotedPairIds]);

  const value: AppState = {
    isAuthed,
    user,
    projects,
    votePairs,
    voteHistory,
    currentPair,
    authPromptAction,
    isBlindMode,
    toggleBlindMode: () => setIsBlindMode((prev) => !prev),
    setBlindMode: setIsBlindMode,
    isAnonymousMode,
    toggleAnonymousMode: () => setIsAnonymousMode((prev) => !prev),
    setAnonymousMode: setIsAnonymousMode,
    login: async (name, email) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) return;

      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
      });
      if (authError) {
        console.error("Error logging in:", authError);
        return;
      }
      if (supabaseUser) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: supabaseUser.id,
            name: name.trim() || normalizedEmail.split("@")[0] || "Hackathon Voter",
            email: normalizedEmail,
          } as any)
          .select()
          .single();
        if (profileError) {
          console.error("Error upserting profile:", profileError);
          return;
        }
        setIsAuthed(true);
        setUser({
          id: supabaseUser.id,
          name: profileData?.name || name.trim() || normalizedEmail.split("@")[0] || "Hackathon Voter",
          email: normalizedEmail,
          projectId: profileData?.project_id ?? null,
        });
        setIsAuthModalOpen(false);
      }
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
        return;
      }
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
      if (isAuthed && !user?.email) {
        setIsAuthed(false);
        setUser(null);
      }
      setAuthPromptAction(action);
      setIsAuthModalOpen(true);
      return false;
    },
    createProject: async ({ name, summary, owner }) => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      const joinCode = generateJoinCode(name);
      const { data: newProjectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: name.trim(),
          description: summary.trim(),
          join_code: joinCode,
          created_by_user_id: user.id,
          tagline: "",
          demo_url: null,
          github_url: null,
          elo_rating: 1200,
        })
        .select()
        .single();
      if (projectError) {
        console.error("Error creating project:", projectError);
        return;
      }
      if (newProjectData) {
        const { error: memberError } = await supabase.from("project_members").insert({
          project_id: newProjectData.id,
          user_id: user.id,
          role: "owner",
        });
        if (memberError) {
          console.error("Error adding project member:", memberError);
          return;
        }
        const newProject: Project = {
          id: newProjectData.id,
          name: newProjectData.name,
          summary: newProjectData.description || "",
          tagline: newProjectData.tagline || "",
          owner: user.name,
          joinCode: newProjectData.join_code,
          created_by_user_id: newProjectData.created_by_user_id,
          elo_rating: 1200,
        };
        setProjects((prev) => [...prev, newProject]);
        setUser((prev) => ({
          id: prev?.id ?? user.id,
          name: prev?.name ?? "Hackathon Voter",
          email: prev?.email ?? "",
          projectId: newProject.id,
        }));
      }
    },
    joinProjectByCode: async (joinCode) => {
      if (!user) {
        return { ok: false, message: "User not authenticated." };
      }
      const normalized = joinCode.trim().toUpperCase();
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("join_code", normalized)
        .single();
      if (projectError || !project) {
        console.error("Error finding project by join code:", projectError?.message);
        return { ok: false, message: "Join code not found. Try again." };
      }
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ project_id: project.id })
        .eq("id", user.id);
      if (profileUpdateError) {
        console.error("Error updating user project ID:", profileUpdateError);
        return { ok: false, message: "Failed to join project." };
      }
      setUser((prev) => ({
        id: prev?.id ?? user.id,
        name: prev?.name ?? "Hackathon Voter",
        email: prev?.email ?? "",
        projectId: project.id,
      }));
      return { ok: true };
    },
    saveProject: async (projectId, update) => {
      const { error } = await supabase
        .from("projects")
        .update({
          name: update.name.trim(),
          description: update.summary.trim(),
        })
        .eq("id", projectId);
      if (error) {
        console.error("Error saving project:", error);
        return;
      }
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, name: update.name.trim(), summary: update.summary.trim() }
            : project
        )
      );
    },
    castVote: async (winnerId, anonymous = false) => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      if (!currentPair) return;

      const userVoteCount = voteHistory.length;
      if (userVoteCount >= 3) {
        console.warn("Vote limit reached (3 votes per session)");
        return;
      }

      const loserId =
        currentPair.leftProjectId === winnerId
          ? currentPair.rightProjectId
          : currentPair.leftProjectId;

      // Build vote insert object - omit session_id if anonymous
      const voteInsert: Record<string, unknown> = {
        left_project_id: currentPair.leftProjectId,
        right_project_id: currentPair.rightProjectId,
        winner_project_id: winnerId,
        created_by_user_id: user.id,
      };
      
      // Only include session_id if NOT voting anonymously
      if (!anonymous) {
        voteInsert.session_id = user.id;
      }

      if (activeHackathonId) {
        voteInsert.hackathon_id = activeHackathonId;
      }

      const { data: newVote, error: voteError } = await supabase
        .from("votes")
        .insert(voteInsert)
        .select()
        .single();

      if (voteError) {
        console.error("Error casting vote:", voteError);
        return;
      }

      if (newVote) {
        // Update Elo ratings after vote
        const result = await updateEloAfterVote(winnerId, loserId);
        if (result) {
          console.log(
            `Elo updated: ${winnerId} -> ${result.winnerNewRating}, ${loserId} -> ${result.loserNewRating}`
          );
        }

        // Refresh projects from server to get updated Elo ratings
        const { data: updatedProjects } = await supabase.from("projects").select("*");
        if (updatedProjects) {
          setProjects(
            updatedProjects.map((p) => ({
              ...p,
              summary: p.description,
          owner: p.team_name || null,
              joinCode: p.join_code,
              elo_rating: p.elo_rating ?? 1200,
              is_featured: p.is_featured ?? false,
            }))
          );
        }

        setVoteHistory((prev) => [
          ...prev,
          {
            pairId: currentPair.id,
            winnerId,
            loserId,
            at: newVote.created_at || new Date().toISOString(),
          },
        ]);

        // Also persist to localStorage for session-level deduplication
        setLocalVotedPairIds((prev) => {
          const next = new Set(prev);
          next.add(currentPair.id);
          try {
            localStorage.setItem("hackathon_voted_pairs", JSON.stringify([...next]));
          } catch {
            // ignore
          }
          return next;
        });
      }
    },
    resetVoting: async () => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      setVoteHistory([]);
      setLocalVotedPairIds(new Set());
      try {
        localStorage.removeItem("hackathon_voted_pairs");
      } catch {
        // ignore
      }
    },
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
