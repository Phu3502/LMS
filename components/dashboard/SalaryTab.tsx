"use client";

import { useEffect, useRef, useState } from "react";

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

type Props = {
  data: RecordType[];
  isAdmin: boolean;
};

export default function SalaryTab({ data, isAdmin }: Props) {
  const [records, setRecords] = useState<RecordType[]>(data);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const [teacherFilter, setTeacherFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selected, setSelected] = useState<RecordType | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
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
      } catch (err) {
        console.error(err);
      } finally {
        isFetchingRef.current = false;
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!modalRef.current?.contains(e.target)) {
        setSelected(null);
      }
    };

    if (selected) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [selected]);

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

  // ================= ADMIN =================
  const handleAdmin = async (status: "approved" | "rejected") => {
    if (!selected) return;

    setRecords(prev =>
      prev.map(r =>
        r.id === selected.id ? { ...r, approval_status: status } : r
      )
    );

    await fetch("/api/attendance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected.id,
        status,
        note: adminNote,
      }),
    });

    setSelected(null);
    setAdminNote("");
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Bảng lương cá nhân</h2>
        <p className="text-slate-500 mt-1">Theo dõi thu nhập từ các lớp học</p>
      </div>

      {/* ACTION */}
      {!isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setOpenForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            + Chấm công
          </button>
        </div>
      )}

      {/* FILTER */}
      <div className="flex flex-wrap gap-4 mb-6 text-zinc-800">
        {isAdmin && (
          <input
            placeholder="Tên giáo viên..."
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        )}

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded-lg px-3 py-2"/>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded-lg px-3 py-2"/>

        <button
          onClick={() => {
            setTeacherFilter("");
            setFromDate("");
            setToDate("");
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div onClick={() => setStatus("pending")}
          className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer ${status==="pending" && "ring-2 ring-amber-300"}`}>
          <p className="text-amber-100 text-sm mb-1">Lương chờ duyệt</p>
          <p className="text-3xl font-bold">{totalPending}</p>
        </div>

        <div onClick={() => setStatus("approved")}
          className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer ${status==="approved" && "ring-2 ring-emerald-300"}`}>
          <p className="text-emerald-100 text-sm mb-1">Tổng lương đã duyệt</p>
          <p className="text-3xl font-bold">{totalApproved}</p>
        </div>

        <div onClick={() => setStatus("rejected")}
          className={`bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer ${status==="rejected" && "ring-2 ring-red-300"}`}>
          <p className="text-red-100 text-sm mb-1">Công bị từ chối</p>
          <p className="text-3xl font-bold">{totalRejected}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-slate-800">Chi tiết chấm công</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 w-[20%] text-left text-xs font-semibold text-slate-600 uppercase">Tên lớp</th>
                {isAdmin && <th className="px-6 py-4 w-[15%] text-left text-xs font-semibold text-slate-600 uppercase">Giáo viên</th>}
                <th className="px-6 py-4 w-[15%] text-left text-xs font-semibold text-slate-600 uppercase">Ngày dạy</th>
                <th className="px-6 py-4 w-[15%] text-left text-xs font-semibold text-slate-600 uppercase">Thời gian</th>
                <th className="px-6 py-4 w-[20%] text-left text-xs font-semibold text-slate-600 uppercase">Ngày chấm công</th>
                <th className="px-6 py-4 w-[15%] text-left text-xs font-semibold text-slate-600 uppercase">Rate</th>
                <th className="px-6 py-4 w-[15%] text-center text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map(item => (
                <tr key={item.id}
                  onClick={() => setSelected(item)}
                  className="hover:bg-slate-50 transition cursor-pointer text-zinc-800">

                  <td className="px-6 py-4 truncate">{item.class_name}</td>
                  {isAdmin && <td className="px-6 py-4">{item.teacher_name || "-"}</td>}
                  <td className="px-6 py-4">{item.attendance_date}</td>
                  <td className="px-6 py-4">{item.attendance_time}</td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td>

                  <td className="px-6 py-4 text-emerald-600 font-semibold">
                    {Number.isFinite(item.rate)
                      ? new Intl.NumberFormat("vi-VN").format(item.rate) + " ₫"
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.approval_status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.approval_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {item.approval_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Không có dữ liệu
          </div>
        )}
      </div>

      {/* CREATE FORM */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[440px] shadow-xl">

            <h3 className="text-lg font-bold mb-4 text-slate-800">
              Tạo chấm công
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                const payload = {
                  class_id: formData.get("class_id"),
                  attendance_date: formData.get("date"),
                  attendance_time: `${formData.get("start_time")} - ${formData.get("end_time")}`,
                  teacher_notes: formData.get("note"),
                };

                const res = await fetch("/api/attendance", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                const newItem = await res.json();
                setRecords(prev => [newItem, ...prev]);
                setOpenForm(false);
              }}
              className="space-y-4"
            >

              {/* CLASS SELECT (SEARCHABLE) */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Tên lớp
                </label>

                <input
                  list="class-list"
                  name="class_id"
                  placeholder="Nhập hoặc chọn lớp..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <datalist id="class-list">
                  {records.map((r) => (
                    <option >
                      {r.class_name}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* DATE */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Ngày dạy
                </label>

                <input
                  type="date"
                  name="date"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-slate-800"
                  required
                />
              </div>

              {/* TIME RANGE */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Thời gian
                </label>

                <div className="flex gap-2 mt-1">
                  <input
                    type="time"
                    name="start_time"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    required
                  />
                  <span className="flex items-center text-slate-500">→</span>
                  <input
                    type="time"
                    name="end_time"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* NOTE */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nhận xét
                </label>

                <textarea
                  name="note"
                  placeholder="Nhập nhận xét..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-slate-800"
                />
              </div>

              {/* ACTION */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Chấm công
                </button>

                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="flex-1 border border-slate-300 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition"
                >
                  Huỷ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-2xl p-6 w-[420px] shadow-xl text-zinc-800">

            <h3 className="text-lg font-bold mb-4">Chi tiết chấm công</h3>

            <p><b>Lớp:</b> {selected.class_name}</p>
            {isAdmin && <p><b>GV:</b> {selected.teacher_name}</p>}
            <p><b>Ngày:</b> {selected.attendance_date}</p>
            <p><b>Thời:</b> {selected.attendance_time}</p>
            <p><b>Rate:</b> {selected.rate}</p>

            <div className="mt-2 bg-slate-50 p-3 rounded">
              <b>Nhận xét:</b><br/>
              {selected.teacher_notes || "Chưa có"}
            </div>

            {isAdmin && (
              <>
                <textarea value={adminNote} onChange={(e)=>setAdminNote(e.target.value)} className="w-full border p-2 mt-3 placeholder:text-slate-500" placeholder="Lý do (nếu từ chối)..."/>
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>handleAdmin("approved")} className="flex-1 bg-green-500 text-white p-2 rounded">Duyệt</button>
                  <button onClick={()=>handleAdmin("rejected")} className="flex-1 bg-red-500 text-white p-2 rounded">Từ chối</button>
                </div>
              </>
            )}

            <button onClick={()=>setSelected(null)} className="w-full mt-4 border p-2 rounded">Đóng</button>
          </div>
        </div>
      )}

    </div>
  );
}