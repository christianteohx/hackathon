import Link from "next/link";
import { redirect } from "next/navigation";
import { createProjectAction } from "@/app/actions/projects";
import { AppNav } from "@/components/app-nav";
import { CreateProjectForm } from "@/components/create-project-form";
import { requireMyContext } from "@/lib/projects";

export default async function CreateProjectPage() {
  const context = await requireMyContext();

  if (!context.profile.displayName || context.membership) {
    redirect("/my");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <AppNav current="my" />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Create Project</h1>
        <p className="text-slate-600">
          Create your project and return to My Page as the owner.
        </p>
      </div>

      <CreateProjectForm action={createProjectAction} />

      <Link href="/my">Back to My Page</Link>
    </main>
  );
}
