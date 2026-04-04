"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

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
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/teachers")
      .then((res) => res.json())
      .then(setTeachers);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacher) {
      alert("Vui lòng chọn giáo viên");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const startDateStr = formData.get("startDate") as string;
    const numSessions = Number(formData.get("numSessions"));

    if (!startDateStr || !numSessions) {
      alert("Thiếu ngày bắt đầu hoặc số buổi");
      return;
    }

    const startDate = new Date(startDateStr);

    // ✅ Lấy weekday (0 = CN, 1 = T2,...)
    const weekdayIndex = startDate.getDay();

    const weekdayMap = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    const weekday = weekdayMap[weekdayIndex];

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (numSessions - 1) * 7);

    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      teacherId: selectedTeacher.id,

      weekday,
      startDate,
      endDate,

      time: formData.get("time"),
      hourlyRate: Number(formData.get("hourlyRate")),
    };

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      alert("Tạo lớp thất bại");
      return;
    }

    onOpenChange(false);
    location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-slate-800 rounded-2xl shadow-xl p-6 space-y-6">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thêm lớp học mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <input
              name="name"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              placeholder="Tên lớp"
              required
            />
          </div>

          <div>
            <input
              name="numSessions"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              placeholder="Số buổi học"
              required
            />
          </div>

          <div>
            <input
              name="description"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              placeholder="Mô tả"
            />
          </div>

          <div ref={dropdownRef} className="relative">

            <input
              type="text"
              placeholder="Tìm và chọn giáo viên..."
              value={selectedTeacher ? selectedTeacher.name : search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedTeacher(null);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {showDropdown && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTeacher(t);
                        setSearch("");
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {t.name}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-slate-400">
                    Không tìm thấy
                  </div>
                )}
              </div>
            )}
          </div>
            
          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="startDate" className="border p-2 rounded-xl" />
            <input type="time" name="time" className="border rounded-lg px-3 py-2 placeholder:text-slate-400" placeholder="Thời gian" />
          </div>

          <input
            name="hourlyRate"
            type="number"
            className="w-full border rounded-lg px-3 py-2 placeholder:text-slate-400"
            placeholder="Rate / giờ (VNĐ)"
            required
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
            Tạo lớp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}