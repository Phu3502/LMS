import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreateUserTab from "@/components/dashboard/CreateUserTab";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <CreateUserTab session={session} />;
}