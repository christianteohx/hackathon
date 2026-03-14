import { redirect } from "next/navigation";

export default function LegacyCreateProjectRedirectPage() {
  redirect("/my/create");
}
