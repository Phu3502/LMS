import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  const h = await headers();

  const session = await auth.api.getSession({
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });

  return session;
});