import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { getSession } from "@/lib/getSession";
import { eq, and, gte, lte, ilike } from "drizzle-orm";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const classId = searchParams.get("classId");
    const teacher = searchParams.get("teacher");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // ================= QUERY =================
    let query = db
      .select({
        id: attendance.id,
        class_id: attendance.classId,
        class_name: classes.name,
        teacher_name: user.name,

        attendance_date: attendance.attendanceDate,
        attendance_time: attendance.attendanceTime,

        created_at: attendance.createdAt,
        approval_status: attendance.approvalStatus,
        teacher_notes: attendance.teacherNotes,

        rate: classes.hourlyRate,
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id));

    const conditions = [];

    // 🔥 role filter
    if (session.user.role !== "admin") {
      conditions.push(eq(attendance.teacherId, session.user.id));
    }

    if (status) {
      conditions.push(eq(attendance.approvalStatus, status));
    }

    if (classId) {
      conditions.push(eq(attendance.classId, classId));
    }

    if (teacher && session.user.role === "admin") {
      conditions.push(ilike(user.name, `%${teacher}%`));
    }

    if (fromDate) {
      conditions.push(gte(attendance.attendanceDate, fromDate));
    }

    if (toDate) {
      conditions.push(lte(attendance.attendanceDate, toDate));
    }

    const data =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return Response.json({ data });

  } catch (error) {
    console.error("ATTENDANCE API ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      class_id,
      attendance_date,
      attendance_time, // "08:00 - 10:00"
      teacher_notes,
    } = body;

    if (!class_id || !attendance_date || !attendance_time) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 lấy start_time từ "08:00 - 10:00"
    const startTime = attendance_time.split(" - ")[0];

    // ================= INSERT =================
    const [created] = await db
      .insert(attendance)
      .values({
        classId: class_id,
        teacherId: session.user.id,

        attendanceDate: attendance_date,
        attendanceTime: startTime, // ⚠️ schema chỉ có 1 time

        teacherNotes: teacher_notes,

        approvalStatus: "pending",
        paymentStatus: "unpaid",
      })
      .returning();

    // ================= RETURN FORMAT (giữ nguyên UI) =================
    const [result] = await db
      .select({
        id: attendance.id,
        class_id: attendance.classId,
        class_name: classes.name,
        teacher_name: user.name,

        attendance_date: attendance.attendanceDate,
        attendance_time: attendance.attendanceTime,

        created_at: attendance.createdAt,
        approval_status: attendance.approvalStatus,
        teacher_notes: attendance.teacherNotes,

        rate: classes.hourlyRate,
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id))
      .where(eq(attendance.id, created.id));

    return Response.json(result);

  } catch (error) {
    console.error("POST ATTENDANCE ERROR:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= PATCH =================
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, attendance_date, attendance_time } = await req.json();

    const [record] = await db
      .select()
      .from(attendance)
      .where(eq(attendance.id, id));

    if (!record) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // ===== ADMIN =====
    if (session.user.role === "admin") {
      await db.update(attendance)
        .set({ approvalStatus: status })
        .where(eq(attendance.id, id));

      return Response.json({ success: true });
    }

    // ===== TEACHER =====
    if (record.teacherId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!["pending", "rejected"].includes(record.approvalStatus)) {
      return Response.json({ error: "Cannot edit" }, { status: 400 });
    }

    await db.update(attendance)
      .set({
        attendanceDate: attendance_date,
        attendanceTime: attendance_time,
      })
      .where(eq(attendance.id, id));

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const [record] = await db
      .select()
      .from(attendance)
      .where(eq(attendance.id, id));

    if (!record) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // ADMIN xoá tất
    if (session.user.role === "admin") {
      await db.delete(attendance).where(eq(attendance.id, id));
      return Response.json({ success: true });
    }

    // TEACHER
    if (record.teacherId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!["pending", "rejected"].includes(record.approvalStatus)) {
      return Response.json({ error: "Cannot delete" }, { status: 400 });
    }

    await db.delete(attendance).where(eq(attendance.id, id));

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}