"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmLogout = confirm("Bạn có chắc muốn đăng xuất?");
    if (!confirmLogout) return;

    await authClient.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl 
      transition-all duration-300
      text-white/70 hover:bg-red-500/10 hover:text-red-400 hover:scale-[1.01]"
    >
      {/* Icon */}
      <LogOut className="w-5 h-5 transition text-white/70 group-hover:text-red-400" />

      {/* Label */}
      <span className="font-medium">Đăng xuất</span>

      {/* Glow effect giống sidebar */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-red-500/5 blur-md" />
    </button>
  );
}