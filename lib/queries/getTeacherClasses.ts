import { db } from "@/src/index";
import { classes, user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getTeacherClasses(
  userId: string,
  role: string
) {
  const baseQuery = db
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

  const query =
    role === "admin"
      ? baseQuery
      : baseQuery.where(eq(classes.teacherId, userId));

  const data = await query
    .orderBy(classes.startDate)
    .limit(20);

  // 🔥 FIX NULL → UNDEFINED
  return data.map((cls) => ({
    ...cls,
    teacherName: cls.teacherName ?? undefined,
  }));
}