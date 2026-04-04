"use client";

import { useState } from "react";
import AddClassModal from "./AddClassModal";
import { Logout } from "../logout";

export default function DashboardTab({ classes, role }: any) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAdmin = role === "admin";

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = confirm("Bạn có chắc muốn xoá các lớp này?");
    if (!confirmDelete) return;

    await fetch("/api/classes/delete", {
      method: "POST",
      body: JSON.stringify({ ids: selectedIds }),
    });

    location.reload();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">
            Danh sách lớp học
          </h2>

          <div className="flex gap-3">
            {/* 🔥 Nút xoá */}
            {isAdmin && selectedIds.length > 0 && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Xoá ({selectedIds.length})
              </button>
            )}

            {/* 🔥 Nút thêm */}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                + Thêm lớp
              </button>
            )}

          </div>
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
          {classes.map((cls: any) => {
            const isSelected = selectedIds.includes(cls.id);

            return (
              <div
                key={cls.id}
                onClick={() => isAdmin && toggleSelect(cls.id)}
                className={`relative cursor-pointer rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                  isSelected ? "ring-2 ring-red-500" : ""
                }`}
              >

                <div className="h-2 bg-blue-500" />

                <div className="p-6 text-zinc-800">
                  <h3 className="text-lg font-semibold">{cls.name}</h3>

                  <p className="text-sm text-slate-500">
                    Giáo viên: {cls.teacherName || "Chưa có giáo viên"}
                  </p>

                  <p className="text-sm">📅 {cls.weekday}</p>
                  <p className="text-sm">⏰ {cls.time}</p>

                  <p className="text-sm">
                    {new Date(cls.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(cls.endDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            );
          })}
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