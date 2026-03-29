import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { eq, desc, and, sql, gte, lte, ilike } from "drizzle-orm";
import { getSession } from "@/lib/getSession";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status"); // pending | approved | rejected
    const classId = searchParams.get("classId");
    const teacher = searchParams.get("teacher");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const isAdmin = session.user.role === "admin";

    const conditions = [];

    // 🔒 USER chỉ thấy của mình
    if (!isAdmin) {
      conditions.push(eq(attendance.teacherId, session.user.id));
    }

    if (status) {
      conditions.push(eq(attendance.approvalStatus, status as any));
    }

    if (classId) {
      conditions.push(eq(attendance.classId, classId));
    }

    if (teacher && isAdmin) {
      conditions.push(ilike(user.name, `%${teacher}%`));
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

        attendance_date: attendance.attendanceDate,
        attendance_time: attendance.attendanceTime,
        teacher_notes: attendance.teacherNotes,

        created_at: attendance.createdAt,
        approval_status: attendance.approvalStatus,

        class_id: classes.id,
        class_name: classes.name,

        // 🔥 FIX QUAN TRỌNG (mất teacher)
        teacher_name: user.name,

        // 🔥 FIX NaN rate
        rate: sql<number>`COALESCE(${classes.rate}, 0)`,
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(attendance.createdAt));

    return Response.json({ data });

  } catch (error) {
    console.error("SALARY API ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}