"use client";

import { useState } from "react";
import AddClassModal from "./AddClassModal";
import { Logout } from "../logout";

export default function DashboardTab({ classes }: any) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">
            Danh sách lớp học
          </h2>
          <Logout />
        </div>
        <p className="text-slate-500 mt-1">
          Quản lý các lớp bạn đang phụ trách
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card card-gradient rounded-2xl p-6 shadow-lg">
          <p className="text-slate-500 text-sm">Tổng lớp dạy</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {classes.length}
          </p>
        </div>
      </div>

      {/* Grid lớp */}
      {classes.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          Chưa có lớp nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls: any) => (
            <div
              key={cls.id}
              className="card-gradient rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="h-2 bg-blue-500" />

              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  {cls.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {cls.studentCount === 1
                    ? "1 học sinh"
                    : `${cls.studentCount} học sinh`}
                </p>

                <p className="text-sm mt-2 text-slate-500">
                  📅 {cls.weekday}
                </p>

                <p className="text-sm text-slate-500">
                  ⏰ {cls.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddClassModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}