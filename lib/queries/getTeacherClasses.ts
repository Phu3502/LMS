import { db } from "@/src/index";
import { classes, user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getTeacherClasses(userId: string, role: string) {
  if (role === "admin") {
    return await db
      .select({
        id: classes.id,
        name: classes.name,
        weekday: classes.weekday,
        time: classes.time,
        startDate: classes.startDate,
        endDate: classes.endDate,
        teacherName: user.name,
      })
      .from(classes)
      .leftJoin(user, eq(classes.teacherId, user.id));
  }

  return await db
    .select({
      id: classes.id,
      name: classes.name,
      weekday: classes.weekday,
      time: classes.time,
      startDate: classes.startDate,
      endDate: classes.endDate,
      teacherName: user.name,
    })
    .from(classes)
    .leftJoin(user, eq(classes.teacherId, user.id))
    .where(eq(classes.teacherId, userId));
}