import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getSalaryData(userId: string, role: string) {
  const isAdmin = role === "admin";

  const data = await db
    .select({
      id: attendance.id,
      class_id: attendance.classId,
      class_name: classes.name,

      attendance_date: attendance.attendanceDate,
      attendance_time: attendance.attendanceTime,

      created_at: attendance.createdAt,
      approval_status: attendance.approvalStatus,
      teacher_notes: attendance.teacherNotes,

      teacher_name: user.name,

      // 💰 RATE
      rate: classes.hourlyRate,
    })
    .from(attendance)
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .leftJoin(user, eq(attendance.teacherId, user.id))
    .where(
      isAdmin ? undefined : eq(attendance.teacherId, userId)
    )
    .orderBy(desc(attendance.createdAt));

  return data;
}