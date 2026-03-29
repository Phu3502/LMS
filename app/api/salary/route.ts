import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { getSession } from "@/lib/getSession";
import { eq, desc, and, gte, lt } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status"); // pending | approved
    const classId = searchParams.get("classId");
    const month = searchParams.get("month"); // YYYY-MM

    const filters = [];

    // 🔐 ROLE FILTER
    if (session.user.role !== "admin") {
      filters.push(eq(attendance.teacherId, session.user.id));
    }

    //  STATUS
    if (status) {
      filters.push(eq(attendance.approvalStatus, status));
    }

    // CLASS
    if (classId) {
      filters.push(eq(attendance.classId, classId));
    }

    //  MONTH
    if (month) {
        const start = `${month}-01`;

        const endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 1);

        const end = endDate.toISOString().split("T")[0];

        filters.push(
            gte(attendance.attendanceDate, start),
            lt(attendance.attendanceDate, end)
        );
    }

    const data = await db
      .select({
        id: attendance.id,

        attendance_date: attendance.attendanceDate,
        attendance_time: attendance.attendanceTime,
        teacher_notes: attendance.teacherNotes,

        teacher_name: user.name,
        created_at: attendance.createdAt,

        approval_status: attendance.approvalStatus,
        payment_status: attendance.paymentStatus,

        class_id: classes.id,
        class_name: classes.name,
        hourly_rate: classes.hourlyRate,
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(attendance.createdAt));

    // ================= SUMMARY =================
    let totalApproved = 0;
    let totalPending = 0;
    let approvedSessions = 0;
    let pendingSessions = 0;

    for (const item of data) {
      const rate = item.hourly_rate ?? 0;

      if (item.approval_status === "approved") {
        totalApproved += rate;
        approvedSessions++;
      }

      if (item.approval_status === "pending") {
        totalPending += rate;
        pendingSessions++;
      }
    }

    return Response.json({
      summary: {
        totalApproved,
        totalPending,
        approvedSessions,
        pendingSessions,
      },
      data,
    });

  } catch (error) {
    console.error("SALARY API ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}