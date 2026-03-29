import { getSession } from "@/lib/getSession";
import { getAttendance } from "@/lib/queries/getAttendance";
import AttendanceTab from "@/components/dashboard/AttendanceTab";
import { redirect } from "next/navigation";
import { getClasses } from "@/lib/queries/getClassess";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [attendance, classes] = await Promise.all([
    getAttendance(session.user.id, session.user.role),
    getClasses(),
  ]);

  return (
    <AttendanceTab
      data={attendance}
      classes={classes}
      isAdmin={session.user.role === "admin"}
    />
  );
}