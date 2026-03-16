// @ts-nocheck
"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { buildVotePairs } from "./mockData";
import { Project, VotePair, VoteRecord } from "./types";
import { supabase } from "@/lib/supabase";

type SessionUser = {
  id: string; // Add user ID
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
  // Blind voting mode state
  isBlindMode: boolean;
  toggleBlindMode: () => void;
  setBlindMode: (enabled: boolean) => void;
};

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [votePairs, setVotePairs] = useState<VotePair[]>([]);
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState("continue");

  // Blind voting mode state
  const [isBlindMode, setIsBlindMode] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      // Fetch user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setIsAuthed(false);
        setUser(null);
      } else if (session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name, projectId")
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
            projectId: profile.projectId,
          });
        }
      }

      // Fetch projects
      const { data: fetchedProjects, error: projectsError } = await supabase
        .from("projects")
        .select("*");

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        setProjects([]);
      } else {
        const mappedProjects = (fetchedProjects || []).map((p) => ({ ...p, summary: p.description, joinCode: p.join_code, }));
      setProjects(mappedProjects as Project[]);
      }

      // Fetch vote history for the current user (if authed)
      // For simplicity, we'll fetch all votes for now and filter later if needed for a specific user.
      // A better approach would be to filter by user_id in the DB query if RLS is set up.
      const { data: fetchedVotes, error: votesError } = await supabase
        .from("votes")
        .select("*");

      if (votesError) {
        console.error("Error fetching votes:", votesError);
        setVoteHistory([]);
      } else {
        setVoteHistory(fetchedVotes || []);
      }

      setHydrated(true);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setVotePairs(buildVotePairs(projects));
  }, [projects]);



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
    // Blind mode functions
    isBlindMode,
    toggleBlindMode: () => setIsBlindMode((prev) => !prev),
    setBlindMode: setIsBlindMode,
    login: async (name, email) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) return;

      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.signInWithOtp({ email: normalizedEmail });

      if (authError) {
        console.error("Error logging in:", authError);
        return;
      }

      if (supabaseUser) {
        // Upsert user profile
      // @ts-expect-error - Supabase type inference issue with profiles table
      const { data: profileData } = await supabase
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
          projectId: profileData?.projectId ?? null,
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
      // force-clear stale local auth states from older schema
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
          // Defaulting optional fields for now
          tagline: "", 
          demo_url: null,
          github_url: null,
        })
        .select()
        .single();

      if (projectError) {
        console.error("Error creating project:", projectError);
        return;
      }

      if (newProjectData) {
        // Add the creator as an owner in project_members
        const { error: memberError } = await supabase.from("project_members").insert({
          project_id: newProjectData.id,
          user_id: user.id,
          role: "owner",
        });

        if (memberError) {
          console.error("Error adding project member:", memberError);
          // Consider rolling back project creation or handling this error appropriately
          return;
        }

        const newProject: Project = {
          id: newProjectData.id,
          name: newProjectData.name,
          summary: newProjectData.description || "", // Assuming summary maps to description
          tagline: newProjectData.tagline || "",
          owner: user.name, // Display name of the owner
          joinCode: newProjectData.join_code,
          created_by_user_id: newProjectData.created_by_user_id,
        };
        setProjects((prev) => [...prev, newProject]);
        setUser((prev) => ({
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

      // Update user's profile with the new projectId
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ projectId: project.id })
        .eq("id", user.id);

      if (profileUpdateError) {
        console.error("Error updating user project ID:", profileUpdateError);
        return { ok: false, message: "Failed to join project." };
      }

      setUser((prev) => ({
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
          description: update.summary.trim(), // Assuming summary maps to description
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
    castVote: async (winnerId) => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      if (!currentPair) return;

      const loserId = currentPair.leftProjectId === winnerId ? currentPair.rightProjectId : currentPair.leftProjectId;

      const { data: newVote, error: voteError } = await supabase.from("votes").insert({
        left_project_id: currentPair.leftProjectId,
        right_project_id: currentPair.rightProjectId,
        winner_project_id: winnerId,
        session_id: user.id, // Using user.id as session_id for now
      }).select().single();

      if (voteError) {
        console.error("Error casting vote:", voteError);
        return;
      }

      if (newVote) {
        setVoteHistory((prev) => [
          ...prev,
          {
            pairId: currentPair.id,
            winnerId,
            loserId,
            at: newVote.created_at || new Date().toISOString(),
          },
        ]);
      }
    },
    resetVoting: async () => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
      // In a real scenario, this would delete votes associated with the user/session
      // For now, we'll just clear local state, or implement a more robust delete later
      setVoteHistory([]);
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
