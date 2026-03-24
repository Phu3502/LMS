"use client";

import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isAdmin = user?.role === "admin";

  const menuItems = [
    {
      id: "dashboard",
      label: "Danh sách lớp",
      icon: "M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z",
    },
    {
      id: "calendar",
      label: "Lịch dạy",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "attendance",
      label: "Chấm công",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2",
    },
    {
      id: "salary",
      label: "Bảng lương",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2",
    },

    ...(isAdmin
      ? [
          {
            id: "create-user",
            label: "Tạo tài khoản",
            icon: "M12 4v16m8-8H4",
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 gradient-bg flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">
              Coremath Academy
            </h1>
            <p className="text-blue-200 text-xs">
              Cổng thông tin giáo viên
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-b border-white/10">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">
                {isPending ? "Loading..." : user?.name || "User"}
              </p>
              <p className="text-blue-200 text-xs">
                {isAdmin ? "Admin" : "Giáo viên"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 text-white shadow-lg scale-[1.02]"
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:scale-[1.01]"
              }`}
            >
              {/* Icon */}
              <svg
                className={`w-5 h-5 transition ${
                  isActive ? "text-white" : "text-white/70 group-hover:text-white"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={item.icon}
                />
              </svg>

              {/* Label */}
              <span className="font-medium">{item.label}</span>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-white/5 blur-md" />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-xs">
              Số buổi đã dạy tháng này
            </span>
            <span className="text-white font-bold">0</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full w-0" />
          </div>
        </div>
      </div>
    </aside>
  );
}