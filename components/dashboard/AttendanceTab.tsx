"use client";

import { useEffect, useRef, useState } from "react";
import AddAttendanceModal from "./AddAttendanceModal";

// ================= TYPES =================
type RecordType = {
  id: string;
  class_id: string;
  class_name: string;
  teacher_name?: string;

  attendance_date: string;
  attendance_time: string;
  created_at: Date;

  approval_status: "pending" | "approved" | "rejected";
  teacher_notes?: string;

  rate: number;
};

type ClassType = {
  id: string;
  name: string;
};

type Props = {
  data: RecordType[];
  classes: ClassType[];
  isAdmin: boolean;
};

export default function SalaryTab({ data, classes, isAdmin }: Props) {
  const [records, setRecords] = useState<RecordType[]>(data);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const [teacherFilter, setTeacherFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selected, setSelected] = useState<RecordType | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const isFetchingRef = useRef(false);

  // ================= POLLING =================
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const res = await fetch("/api/attendance");
        const result = await res.json();
        setRecords(result.data);
      } finally {
        isFetchingRef.current = false;
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // ================= FILTER =================
  const filtered = records.filter((r) => {
    if (r.approval_status !== status) return false;

    if (isAdmin && teacherFilter) {
      if (!r.teacher_name?.toLowerCase().includes(teacherFilter.toLowerCase())) {
        return false;
      }
    }

    const d = new Date(r.attendance_date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;

    return true;
  });

  // ================= COUNTS =================
  const totalPending = records.filter(r => r.approval_status === "pending").length;
  const totalApproved = records.filter(r => r.approval_status === "approved").length;
  const totalRejected = records.filter(r => r.approval_status === "rejected").length;

  const getStatusColor = (status: string) => {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Chấm công</h2>
        <p className="text-slate-500 mt-1">Theo dõi buổi dạy & thu nhập</p>
      </div>

      {/* ACTION */}
      {!isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setOpenForm(true)}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            + Chấm công
          </button>
        </div>
      )}

      {/* FILTER */}
      <div className="flex flex-wrap gap-3 mb-6 text-zinc-600">
        {isAdmin && (
          <input
            placeholder="Tên giáo viên..."
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        )}

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"/>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"/>

        <button
          onClick={() => {
            setTeacherFilter("");
            setFromDate("");
            setToDate("");
          }}
          className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div onClick={() => setStatus("pending")}
          className={`cursor-pointer rounded-2xl p-5 text-white shadow-lg transition hover:scale-[1.02] ${
            status === "pending" ? "ring-2 ring-amber-300" : ""
          } bg-gradient-to-br from-amber-500 to-orange-600`}>
          <p className="text-sm opacity-80">Chờ duyệt</p>
          <p className="text-3xl font-bold mt-1">{totalPending}</p>
        </div>

        <div onClick={() => setStatus("approved")}
          className={`cursor-pointer rounded-2xl p-5 text-white shadow-lg transition hover:scale-[1.02] ${
            status === "approved" ? "ring-2 ring-emerald-300" : ""
          } bg-gradient-to-br from-emerald-500 to-teal-600`}>
          <p className="text-sm opacity-80">Đã duyệt</p>
          <p className="text-3xl font-bold mt-1">{totalApproved}</p>
        </div>

        <div onClick={() => setStatus("rejected")}
          className={`cursor-pointer rounded-2xl p-5 text-white shadow-lg transition hover:scale-[1.02] ${
            status === "rejected" ? "ring-2 ring-red-300" : ""
          } bg-gradient-to-br from-red-500 to-rose-600`}>
          <p className="text-sm opacity-80">Bị từ chối</p>
          <p className="text-3xl font-bold mt-1">{totalRejected}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Lớp</th>
              {isAdmin && <th className="px-6 py-4 text-left">GV</th>}
              <th className="px-6 py-4 text-left">Ngày</th>
              <th className="px-6 py-4 text-left">Giờ</th>
              <th className="px-6 py-4 text-left">Rate</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map(item => (
              <tr
                key={item.id}
                onClick={() => setSelected(item)}
                className="hover:bg-slate-50 cursor-pointer transition"
              >
                <td className="px-6 py-4 text-zinc-600">{item.class_name}</td>
                {isAdmin && <td className="px-6 py-4 text-zinc-600">{item.teacher_name}</td>}
                <td className="px-6 py-4 text-zinc-600">{item.attendance_date}</td>
                <td className="px-6 py-4 text-zinc-600">{item.attendance_time}</td>
                <td className="px-6 py-4 text-emerald-600 font-semibold">
                  {new Intl.NumberFormat("vi-VN").format(item.rate)} ₫
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(item.approval_status)}`}>
                    {item.approval_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl space-y-4 text-zinc-800">

            <h3 className="text-lg font-bold">Chi tiết chấm công</h3>

            <div className="space-y-1 text-sm">
              <div><b>Lớp:</b> {selected.class_name}</div>
              {isAdmin && <div><b>GV:</b> {selected.teacher_name}</div>}
              <div><b>Ngày:</b> {selected.attendance_date}</div>
              <div><b>Giờ:</b> {selected.attendance_time}</div>
              <div>
                <b>Trạng thái:</b> 
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selected.approval_status)}`}>
                    {selected.approval_status}
                </span>
              </div>
            </div>

            {/* ADMIN */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await fetch("/api/attendance", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: selected.id, status: "approved" }),
                    });

                    setRecords(prev =>
                      prev.map(r => r.id === selected.id ? { ...r, approval_status: "approved" } : r)
                    );
                    setSelected(null);
                  }}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Duyệt
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/attendance", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: selected.id, status: "rejected" }),
                    });

                    setRecords(prev =>
                      prev.map(r => r.id === selected.id ? { ...r, approval_status: "rejected" } : r)
                    );
                    setSelected(null);
                  }}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Reject
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/attendance", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: selected.id }),
                    });

                    setRecords(prev => prev.filter(r => r.id !== selected.id));
                    setSelected(null);
                  }}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Xoá
                </button>
              </div>
            )}

            {/* TEACHER */}
            {!isAdmin && ["pending", "rejected"].includes(selected.approval_status) && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenForm(true);
                    setSelected(null);
                  }}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Sửa
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/attendance", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: selected.id }),
                    });

                    setRecords(prev => prev.filter(r => r.id !== selected.id));
                    setSelected(null);
                  }}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Xoá
                </button>
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="w-full border rounded-lg py-2"
            >
              Đóng
            </button>

          </div>
        </div>
      )}

      <AddAttendanceModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        classes={classes}
        onCreated={(item) => setRecords(prev => [item, ...prev])}
      />
    </div>
  );
}