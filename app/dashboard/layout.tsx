import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return (
    <div className="flex">
      <Sidebar session={session} />
      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}