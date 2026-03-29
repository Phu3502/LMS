import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import {
  eq,
  desc,
  and,
  sql,
  ilike,
  gte,
  lte,
} from "drizzle-orm";

export async function findAttendance(params: {
  userId: string;
  isAdmin: boolean;

  status?: string | null;
  classId?: string | null;
  teacher?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}) {
  const conditions = [];

  // 🔒 USER restriction
  if (!params.isAdmin) {
    conditions.push(eq(attendance.teacherId, params.userId));
  }

  if (params.status) {
    conditions.push(eq(attendance.approvalStatus, params.status as any));
  }

  if (params.classId) {
    conditions.push(eq(attendance.classId, params.classId));
  }

  if (params.teacher && params.isAdmin) {
    conditions.push(ilike(user.name, `%${params.teacher}%`));
  }

  if (params.fromDate) {
    conditions.push(gte(attendance.attendanceDate, params.fromDate));
  }

  if (params.toDate) {
    conditions.push(lte(attendance.attendanceDate, params.toDate));
  }

  const data = await db
    .select({
      id: attendance.id,

      attendance_date: attendance.attendanceDate,
      attendance_time: attendance.attendanceTime,

      created_at: attendance.createdAt,
      approval_status: attendance.approvalStatus,

      teacher_notes: attendance.teacherNotes,

      class_id: classes.id,
      class_name: classes.name,

      teacher_id: user.id,
      teacher_name: user.name, 

      rate: sql<number>`COALESCE(${classes.hourlyRate}, 0)`,
    })
    .from(attendance)
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .leftJoin(user, eq(attendance.teacherId, user.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(attendance.createdAt));

  return data;
}