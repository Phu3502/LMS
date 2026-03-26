import { db } from "@/src/index";
import { classes } from "@/src/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

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

    const data = await db
      .select()
      .from(classes)
      .where(eq(classes.teacherId, session.user.id));

    return Response.json(data);
  } catch (error) {
    console.error("GET CLASSES ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}