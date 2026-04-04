import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/getSession";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, password, name, role } = await req.json();

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Tạo tài khoản thành công",
  });
}