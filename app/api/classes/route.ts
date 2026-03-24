import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/index";
import { classes } from "@/src/db/schema";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  const body = await req.json();

  await db.insert(classes).values({
    id: nanoid(),
    name: body.name,
    description: body.description,

    teacherId: body.teacherId, 
    createdBy: session.user.id,

    weekday: body.weekday,
    time: body.time,

    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),

    hourlyRate: Number(body.hourlyRate),
});

  return Response.json({ success: true });
}