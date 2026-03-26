"use client";

import { authClient } from "@/lib/auth-client";
import { SignupForm } from "../signup-form";

export default function CreateUserTab() {
  const { data: session } = authClient.useSession();

  if (session?.user.role !== "admin") {
    return (
      <div className="p-8 text-red-500">
        Bạn không có quyền truy cập
      </div>
    );
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-zinc-800">
        <SignupForm />
      </div>
    </div>
  );
}