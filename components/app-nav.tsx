import Link from "next/link";

type AppNavProps = {
  current: "my" | "vote";
};

export function AppNav({ current }: AppNavProps) {
  const target =
    current === "my"
      ? { href: "/vote", label: "Go to Voting" }
      : { href: "/my", label: "Back to My Page" };

  return (
    <div className="flex items-center justify-between">
      <Link href="/">Home</Link>
      <Link href={target.href}>{target.label}</Link>
    </div>
  );
}
