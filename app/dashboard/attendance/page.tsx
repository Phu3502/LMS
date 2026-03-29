// app/dashboard/attendance/page.tsx
import { getSession } from "@/lib/getSession";
import { getAttendance } from "@/lib/queries/getAttendance";
import AttendanceTab from "@/components/dashboard/AttendanceTab";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const data = await getAttendance(
    session.user.id,
    session.user.role
  );

  return <AttendanceTab data={data} />;
}