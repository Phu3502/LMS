"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddClassModal({ open, onOpenChange }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");

  // load teachers
  useEffect(() => {
    fetch("/api/teachers")
      .then((res) => res.json())
      .then(setTeachers);
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      teacherId: formData.get("teacherId"),
      weekday: formData.get("weekday"),
      time: formData.get("time"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      hourlyRate: formData.get("hourlyRate"),
    };

    await fetch("/api/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });

    onOpenChange(false);
    location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Thêm lớp học</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Tên lớp" className="w-full border p-2" />

          <input name="description" placeholder="Mô tả" className="w-full border p-2" />

          {/* 🔥 SEARCH TEACHER */}
          <input
            placeholder="Tìm giáo viên..."
            className="w-full border p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔥 DROPDOWN */}
          <select name="teacherId" className="w-full border p-2" required>
            <option value="">Chọn giáo viên</option>
            {filteredTeachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input name="weekday" placeholder="Thứ" className="w-full border p-2" />
          <input name="time" placeholder="Giờ" className="w-full border p-2" />

          <input name="startDate" type="date" className="w-full border p-2" />
          <input name="endDate" type="date" className="w-full border p-2" />

          {/* 💰 SALARY */}
          <input
            name="hourlyRate"
            type="number"
            placeholder="Lương / giờ (VNĐ)"
            className="w-full border p-2"
            required
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Tạo lớp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}