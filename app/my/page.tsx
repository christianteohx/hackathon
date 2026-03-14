import { logoutAction, updateProfileAction } from "@/app/actions/auth";
import { updateProjectAction } from "@/app/actions/projects";
import { AppNav } from "@/components/app-nav";
import { FlashMessage } from "@/components/flash-message";
import { MyPageEmptyState } from "@/components/my-page-empty-state";
import { ProfileForm } from "@/components/profile-form";
import { ProjectDashboard } from "@/components/project-dashboard";
import { requireMyContext } from "@/lib/projects";

type MyPageProps = {
  searchParams?: {
    success?: string;
  };
};

function getSuccessMessage(success?: string) {
  switch (success) {
    case "profile-saved":
      return "Profile saved.";
    case "project-created":
      return "Project created.";
    case "project-joined":
      return "Project joined.";
    case "project-saved":
      return "Project saved.";
    default:
      return null;
  }
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const context = await requireMyContext();
  const successMessage = getSuccessMessage(searchParams?.success);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <AppNav current="my" />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">My Page</h1>
        <p className="text-slate-600">
          Manage your profile, project, and voting entry point.
        </p>
      </div>

      <FlashMessage success={successMessage} />

      {!context.profile.displayName ? (
        <section className="space-y-4 rounded border border-slate-200 p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Complete your profile</h2>
            <p className="text-slate-600">
              Add a display name before creating or joining a project.
            </p>
          </div>

          <ProfileForm action={updateProfileAction} />
        </section>
      ) : !context.membership || !context.project ? (
        <MyPageEmptyState
          logoutAction={logoutAction}
          profile={context.profile}
        />
      ) : (
        <ProjectDashboard
          authUser={context.authUser}
          logoutAction={logoutAction}
          membership={context.membership}
          profile={context.profile}
          project={context.project}
          updateProjectAction={updateProjectAction}
        />
      )}
    </main>
  );
}
