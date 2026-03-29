import { getSession } from "@/lib/getSession";
import { getTeacherClasses } from "@/lib/queries/getTeacherClasses";
import CalendarTab from "@/components/dashboard/CalendarTab";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const classes = await getTeacherClasses(
    session.user.id,
    session.user.role
  );

  return <CalendarTab classes={classes} role={session.user.role} />;
}