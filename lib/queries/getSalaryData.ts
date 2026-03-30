import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";


type ApprovalStatus = "pending" | "approved" | "rejected";


function normalizeStatus(value: string | null): ApprovalStatus {
  if (value === "approved" || value === "rejected") return value;
  return "pending";
}


export async function getSalaryData(userId: string, role: string) {
  const isAdmin = role === "admin";

  const baseQuery = db
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
      rate: classes.hourlyRate,
    })
    .from(attendance)
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .leftJoin(user, eq(attendance.teacherId, user.id));

  const query = isAdmin
    ? baseQuery
    : baseQuery.where(eq(attendance.teacherId, userId));

  const data = await query.orderBy(desc(attendance.createdAt));


  return data.map((item) => ({
    ...item,

    class_name: item.class_name ?? "",

    teacher_name: item.teacher_name ?? undefined,

    rate: item.rate ?? 0,

    approval_status: normalizeStatus(item.approval_status),

    teacher_notes: item.teacher_notes ?? undefined,
  }));
}