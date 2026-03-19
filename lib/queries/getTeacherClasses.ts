import { eq, count } from "drizzle-orm"
import { classes, students } from "@/src/db/schema";
import { db } from "@/src";

export async function getTeacherClasses(userId: string) {
  return db
    .select({
      id: classes.id,
      name: classes.name,
      weekday: classes.weekday,
      time: classes.time,
      studentCount: count(students.id)
    })
    .from(classes)
    .leftJoin(students, eq(classes.id, students.classId))
    .where(eq(classes.teacherId, userId))
    .groupBy(classes.id)
}