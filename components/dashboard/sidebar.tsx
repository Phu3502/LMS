"use client";

import { Logout } from "../logout";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ session }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Danh sách lớp",
      path: "/dashboard",
      icon: "M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z",
    },
    {
      id: "calendar",
      label: "Lịch dạy",
      path: "/dashboard/calendar",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "attendance",
      label: "Chấm công",
      path: "/dashboard/attendance",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2",
    },
    // {
    //   id: "salary",
    //   label: "Bảng lương",
    //   path: "/dashboard/salary",
    //   icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2",
    // },
    ...(isAdmin
      ? [
          {
            id: "create-user",
            label: "Tạo tài khoản",
            path: "/dashboard/create-user",
            icon: "M12 4v16m8-8H4",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
      >
        ☰
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
        fixed md:static z-50 h-screen
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${collapsed ? "md:w-20" : "md:w-64"}
        w-64 gradient-bg flex flex-col flex-shrink-0
        transition-all duration-300
      `}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          {!collapsed && (
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
          )}

          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="p-2 rounded-lg hover:bg-white/10 text-white"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* USER */}
        <div className="p-4 border-b border-white/10">
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.[0] || "U"}
                </span>
              </div>

              {!collapsed && (
                <div>
                  <p className="text-white font-semibold">
                    {user?.name || "User"}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {isAdmin ? "Admin" : "Giáo viên"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.path);
                  setMobileOpen(false);
                }}
                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg scale-[1.02]"
                    : "text-white/70 hover:bg-white/10 hover:text-white hover:scale-[1.01]"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition ${
                    isActive
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth="2" d={item.icon} />
                </svg>

                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}

                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-white/5 blur-md" />
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Logout />
        </div>

        {/* <div className="p-4 border-t border-white/10">
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
        </div> */}
      </aside>
    </>
  );
}