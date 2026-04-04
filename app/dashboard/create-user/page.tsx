import CreateUserTab from "@/components/dashboard/CreateUserTab";
import { getSession } from "@/lib/getSession";

export default async function Page() {
  const session = await getSession();

  return <CreateUserTab session={session} />;
}