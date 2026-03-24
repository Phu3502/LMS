import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/index";
import { classes } from "@/src/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  const { ids } = await req.json();

  if (!ids || ids.length === 0) {
    return new Response("No ids provided", { status: 400 });
  }

  await db.delete(classes).where(inArray(classes.id, ids));

  return Response.json({ success: true });
}