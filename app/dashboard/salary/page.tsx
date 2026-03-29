// app/dashboard/salary/page.tsx
import { getSession } from "@/lib/getSession";
import { getTeacherClasses } from "@/lib/queries/getTeacherClasses";
import SalaryTab from "@/components/dashboard/SalaryTab";

export default async function Page() {
  const session = await getSession();

  const classes = await getTeacherClasses(
    session.user.id,
    session.user.role
  );

  return <SalaryTab classes={classes} />;
}