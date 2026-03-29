import { db } from "@/src/index";
import { classes } from "@/src/db/schema";

export async function getClasses() {
  return db.select({
    id: classes.id,
    name: classes.name,
    rate: classes.hourlyRate,
  }).from(classes);
}