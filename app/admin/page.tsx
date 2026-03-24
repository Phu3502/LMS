import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="flex gap-4">
        <a href="/admin/classes">Quản lý lớp</a>
        <a href="/admin/users">Tạo tài khoản</a>
      </div>
    </div>
  );
}