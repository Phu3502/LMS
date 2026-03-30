import { db } from "@/src/index";
import { classes } from "@/src/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/getSession";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "admin";

    const data = isAdmin
      ? await db.select().from(classes)
      : await db
          .select()
          .from(classes)
          .where(eq(classes.teacherId, session.user.id));

    return Response.json(data);
  } catch (error) {
    console.error("GET CLASSES ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    if (!body.name || !body.teacherId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newClass = await db
      .insert(classes)
      .values({
        id: crypto.randomUUID(), 

        name: body.name,
        description: body.description || "",

        teacherId: body.teacherId,
        createdBy: session.user.id, 

        weekday: body.weekday || "",
        time: body.time || "",

        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),

        hourlyRate: Number(body.hourlyRate) || 0,
      })
      .returning();

    return Response.json(newClass[0]);
  } catch (error) {
    console.error("POST CLASS ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}