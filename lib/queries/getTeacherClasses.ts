import { db } from "@/src";
import { classes, students } from "@/src/db/schema";
import { eq, count } from "drizzle-orm";

export async function getTeacherClasses(userId: string) {
  try {
    return await db
      .select({
        id: classes.id,
        name: classes.name,
        weekday: classes.weekday,
        time: classes.time,
        studentCount: count(students.id).as("studentCount"),
      })
      .from(classes)
      .leftJoin(students, eq(classes.id, students.classId))
      .where(eq(classes.teacherId, userId))
      .groupBy(
        classes.id,
        classes.name,
        classes.weekday,
        classes.time
      );
  } catch (err: any) {
    console.error("🔥 DB ERROR:", err);
    throw err;
  }
}