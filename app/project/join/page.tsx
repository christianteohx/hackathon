import Link from "next/link";
import { redirect } from "next/navigation";
import { joinProjectByCodeAction } from "@/app/actions/projects";
import { AppNav } from "@/components/app-nav";
import { JoinProjectForm } from "@/components/join-project-form";
import { requireMyContext } from "@/lib/projects";

export default async function JoinProjectPage() {
  const context = await requireMyContext();

  if (!context.profile.displayName || context.membership) {
    redirect("/my");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <AppNav current="my" />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Join Project</h1>
        <p className="text-slate-600">
          Enter a join code to attach yourself to an existing project.
        </p>
      </div>

      <JoinProjectForm action={joinProjectByCodeAction} />

      <Link href="/my">Back to My Page</Link>
    </main>
  );
}
