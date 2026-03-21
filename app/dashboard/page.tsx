import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getTeacherClasses } from "@/lib/queries/getTeacherClasses"
import DashboardClient from "./dashboardClient"

export default async function DashboardPage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>Chưa đăng nhập</div>
  }

  const classes = await getTeacherClasses(session.user.id)
  return <DashboardClient classes={classes} />
}