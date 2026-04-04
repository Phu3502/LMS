import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

type Params = {
  userId: string;
  isAdmin: boolean;

  status?: string | null;
  classId?: string | null;
  teacher?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
};

function normalizeStatus(value: string | null) {
  if (value === "approved" || value === "rejected") return value;
  return "pending";
}

export async function getAttendanceData(params: Params) {
  const {
    userId,
    isAdmin,
    status,
    classId,
    fromDate,
    toDate,
  } = params;

  const conditions = [];

  if (!isAdmin) {
    conditions.push(eq(attendance.teacherId, userId));
  }

  if (status) {
    conditions.push(eq(attendance.approvalStatus, status));
  }

  if (classId) {
    conditions.push(eq(attendance.classId, classId));
  }

  if (fromDate) {
    conditions.push(gte(attendance.attendanceDate, fromDate));
  }

  if (toDate) {
    conditions.push(lte(attendance.attendanceDate, toDate));
  }

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
      rate: classes.hourlyRate,
    })
    .from(attendance)
    .leftJoin(classes, eq(attendance.classId, classes.id))
    .leftJoin(user, eq(attendance.teacherId, user.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(attendance.createdAt));

  return data.map((item) => ({
    ...item,
    class_name: item.class_name ?? "",
    teacher_name: item.teacher_name ?? undefined,
    rate: item.rate ?? 0,
    approval_status: normalizeStatus(item.approval_status),
    teacher_notes: item.teacher_notes ?? undefined,
  }));
}