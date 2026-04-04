"use client";

import { useState } from "react";

type ClassType = {
  id: string;
  name: string;
};

export default function AddAttendanceModal({
  open,
  onClose,
  classes,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  classes: ClassType[];
  onCreated: (item: any) => void;
}) {
  const [selectedClassId, setSelectedClassId] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[440px] shadow-xl text-zinc-800">

        <h3 className="text-lg font-bold mb-4">Tạo chấm công</h3>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (!selectedClassId) {
              alert("Chọn lớp hợp lệ");
              return;
            }

            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            const payload = {
              class_id: selectedClassId,
              attendance_date: formData.get("date"),
              attendance_time: `${formData.get("start_time")} - ${formData.get("end_time")}`,
              teacher_notes: formData.get("note"),
            };

            const res = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            // 🔥 FIX crash
            if (!res.ok) {
              const text = await res.text();
              console.error(text);
              alert("Tạo thất bại");
              return;
            }

            const newItem = await res.json();

            onCreated(newItem);
            onClose();
          }}
          className="space-y-4"
        >

          {/* CLASS */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Tên lớp
            </label>

            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              required
            >
              <option value="">Chọn lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input type="date" name="date" className="w-full border rounded-lg px-3 py-2" required />

          <div className="flex gap-2">
            <input type="time" name="start_time" className="flex-1 border rounded-lg px-3 py-2" required />
            <input type="time" name="end_time" className="flex-1 border rounded-lg px-3 py-2" required />
          </div>

          <textarea name="note" className="w-full border rounded-lg px-3 py-2" placeholder="Ghi chú" />

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Chấm công
            </button>

            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-lg hover:bg-gray-100">
              Huỷ
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}