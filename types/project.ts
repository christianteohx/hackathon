export type ActionResult = { error?: string; message?: string; ok: boolean; redirectTo?: string; user?: { id: string; email: string; name?: string; }; };
export type AuthUser = { email: string; id: string; };
export type ProjectMembershipRole = "member" | "owner";
export type UserProfile = { createdAt: string; displayName: string | null; email: string; id: string; updatedAt: string; };
export type Project = { createdAt: string; createdByUserId: string; demoUrl: string | null; description: string; githubUrl: string | null; id: string; joinCode: string; name: string; tagline: string; updatedAt: string; };
export type ProjectMembership = { joinedAt: string; projectId: string; role: ProjectMembershipRole; userId: string; };
export type MyContext = { authUser: AuthUser; membership: ProjectMembership | null; profile: UserProfile; project: Project | null; };
export type ProjectInput = { demoUrl: string | null; description: string; githubUrl: string | null; name: string; tagline: string; };
