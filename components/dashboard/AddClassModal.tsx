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

    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      teacherId: selectedTeacher.id,
      weekday: formData.get("weekday"),
      time: formData.get("time"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      hourlyRate: Number(formData.get("hourlyRate")),
    };

    await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    onOpenChange(false);
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

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Tên lớp
            </label>
            <input
              name="name"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Mô tả
            </label>
            <input
              name="description"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* TEACHER COMBOBOX */}
          <div ref={dropdownRef} className="relative">
            <label className="text-sm font-medium text-slate-600">
              Giáo viên
            </label>

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

          {/* TIME ROW */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">
                Thứ
              </label>
              <input
                name="weekday"
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Thời gian
              </label>
              <input
                name="time"
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* DATE RANGE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-3 bg-blue-50">
              <label className="text-xs text-blue-600 font-semibold">
                Ngày bắt đầu
              </label>
              <input
                name="startDate"
                type="date"
                className="mt-1 w-full bg-transparent outline-none text-slate-800"
              />
            </div>

            <div className="border rounded-xl p-3 bg-rose-50">
              <label className="text-xs text-rose-600 font-semibold">
                Ngày kết thúc
              </label>
              <input
                name="endDate"
                type="date"
                className="mt-1 w-full bg-transparent outline-none text-slate-800"
              />
            </div>
          </div>

          {/* RATE */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Lương / buổi (VNĐ)
            </label>
            <input
              name="hourlyRate"
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SUBMIT */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition font-medium">
            Tạo lớp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}