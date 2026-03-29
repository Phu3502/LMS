import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSessionCached() {
  const h = await headers();

  return auth.api.getSession({
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });
}