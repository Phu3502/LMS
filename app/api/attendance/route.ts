import { getSession } from "@/lib/getSession";
import { getAttendanceData } from "@/src/modules/attendance/service";

// ================= GET =================
export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const result = await getAttendanceData({
      userId: session.user.id,
      isAdmin: session.user.role === "admin",

      status: searchParams.get("status"),
      classId: searchParams.get("classId"),
      teacher: searchParams.get("teacher"),
      fromDate: searchParams.get("fromDate"),
      toDate: searchParams.get("toDate"),
    });

    return Response.json(result);

  } catch (error) {
    console.error("ATTENDANCE API ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}