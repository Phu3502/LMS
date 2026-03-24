import { db } from "@/src/index";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const teachers = await db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user)
    .where(eq(user.role, "teacher"));

  return Response.json(teachers);
}