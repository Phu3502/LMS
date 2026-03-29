import { getSession } from "@/lib/getSession";
import { getSalaryData } from "@/lib/queries/getSalaryData";
import SalaryTab from "@/components/dashboard/SalaryTab";
import { redirect } from "next/navigation";
import { getClasses } from "@/lib/queries/getClassess";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [data, classes] = await Promise.all([
    getSalaryData(session.user.id, session.user.role),
    getClasses(),
  ]);

  return (
    <SalaryTab
      data={data}
      classes={classes}
      isAdmin={session.user.role === "admin"}
    />
  );
}