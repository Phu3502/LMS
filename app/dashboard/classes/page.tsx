import { getTeacherClasses } from "@/lib/queries/getTeacherClasses";
import DashboardTab from "@/components/dashboard/DashboardTab";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function ClassesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const classes = await getTeacherClasses(
    session.user.id,
    session.user.role
  );

  return <DashboardTab classes={classes} role={session.user.role} />;
}