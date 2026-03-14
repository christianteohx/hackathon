import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { FlashMessage } from "@/components/flash-message";
import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

function getLoginErrorMessage(error?: string) {
  if (error === "auth-callback-failed") {
    return "We could not complete the sign-in flow. Try again.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/my");
  }

  const error = getLoginErrorMessage(searchParams?.error);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="text-slate-600">
          Sign in with a magic link to continue to your project dashboard.
        </p>
      </div>

      <FlashMessage error={error} />
      <LoginForm action={loginAction} />
    </main>
  );
}
