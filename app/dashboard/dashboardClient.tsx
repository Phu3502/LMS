"use client";

import { useState } from "react";
import DashboardTab from "@/components/dashboard/DashboardTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import AttendanceTab from "@/components/dashboard/AttendanceTab";
import SalaryTab from "@/components/dashboard/SalaryTab";
import Sidebar from "@/components/dashboard/sidebar";
import CreateUserTab from "@/components/dashboard/CreateUserTab";

export default function DashboardClient({ classes, role }: any) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto bg-slate-50">
        {activeTab === "dashboard" && (
          <DashboardTab classes={classes} role={role} />
        )}
        {activeTab === "calendar" && (
          <CalendarTab classes={classes} role={role} />
        )}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "salary" && <SalaryTab />}
        {activeTab === "create-user" && <CreateUserTab />}
      </main>
    </div>
  );
}