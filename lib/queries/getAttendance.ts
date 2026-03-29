import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAttendance(userId: string, role: string) {
  const query = db
    .select({
      id: attendance.id,
      class_name: classes.name,
      teacher_name: user.name,
      created_at: attendance.createdAt,
    })
    .from(attendance)
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .leftJoin(user, eq(attendance.teacherId, user.id))
    .orderBy(desc(attendance.createdAt))
    .limit(20);

  if (role !== "admin") {
    query.where(eq(attendance.teacherId, userId));
  }

  return await query;
}