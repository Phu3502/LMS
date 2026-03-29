import { getTeacherClasses } from "@/lib/queries/getTeacherClasses";
import DashboardTab from "@/components/dashboard/DashboardTab";
import { getSession } from "@/lib/getSession";

export default async function ClassesPage() {
  const session = await getSession();

  const classes = await getTeacherClasses(
    session.user.id,
    session.user.role
  );

  return <DashboardTab classes={classes} role={session.user.role} />;
}