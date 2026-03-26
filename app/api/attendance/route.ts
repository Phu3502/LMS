import { db } from "@/src/index";
import { attendance, classes, user } from "@/src/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

// ================= GET =================
export async function GET() {
  try {
    const h = await headers();

    const session = await auth.api.getSession({
      headers: {
        cookie: h.get("cookie") ?? "",
      },
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "admin";

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
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id))
      .where(
        isAdmin
          ? eq(attendance.approvalStatus, "pending")
          : eq(attendance.teacherId, session.user.id)
      )
      .orderBy(desc(attendance.createdAt));

    return Response.json(data);
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const h = await headers();

    const session = await auth.api.getSession({
      headers: {
        cookie: h.get("cookie") ?? "",
      },
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.class_id || !body.attendance_date || !body.attendance_time) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const inserted = await db
      .insert(attendance)
      .values({
        classId: body.class_id,
        teacherId: session.user.id,

        attendanceDate: body.attendance_date,
        attendanceTime: body.attendance_time,
        teacherNotes: body.teacher_notes ?? null,

        approvalStatus: "pending",
        paymentStatus: "unpaid",
      })
      .returning();

    const record = inserted[0];

    const result = await db
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
      })
      .from(attendance)
      .leftJoin(classes, eq(attendance.classId, classes.id))
      .leftJoin(user, eq(attendance.teacherId, user.id))
      .where(eq(attendance.id, record.id));

    return Response.json(result[0]);
  } catch (error) {
    console.error("CREATE ATTENDANCE ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ================= PATCH (ADMIN) =================
export async function PATCH(req: Request) {
  try {
    const h = await headers();

    const session = await auth.api.getSession({
      headers: {
        cookie: h.get("cookie") ?? "",
      },
    });

    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    await db
      .update(attendance)
      .set({
        approvalStatus: body.status,
        teacherNotes: body.note ?? null,
      })
      .where(eq(attendance.id, body.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}