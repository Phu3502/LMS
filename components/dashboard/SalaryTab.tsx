'use client';

import { useEffect, useMemo, useState, useCallback } from "react";

// ================= TYPES =================
type ApprovalStatus = "pending" | "approved";

interface SalaryItem {
  id: string;
  class_id: string;
  class_name: string;
  attendance_date: string;
  attendance_time: string;
  created_at: string;
  hourly_rate: number | null;
  approval_status: ApprovalStatus;
}

interface SalaryResponse {
  data: SalaryItem[];
}

// ================= UTILS =================
const formatCurrency = (value?: number | null) => {
  if (!value) return "-";
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

const getUniqueClasses = (data: SalaryItem[]) => {
  return Array.from(
    new Map(
      data.map((item) => [
        item.class_id,
        { id: item.class_id, name: item.class_name },
      ])
    ).values()
  );
};

// ================= COMPONENT =================
export default function SalaryTab() {
  // filters
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [month, setMonth] = useState("");
  const [classId, setClassId] = useState("");

  // data
  const [data, setData] = useState<SalaryItem[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  // state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH =================
  const fetchSalary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (classId) params.append("classId", classId);
      if (month) params.append("month", month);

      const res = await fetch(`/api/salary?${params.toString()}`);

      if (!res.ok) throw new Error("Fetch failed");

      const json: SalaryResponse = await res.json();

      setData(json.data ?? []);
      setClasses(getUniqueClasses(json.data ?? []));
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [classId, month]);

  useEffect(() => {
    fetchSalary();
  }, [fetchSalary]);

  // ================= DERIVED STATE =================

  // summary (ALL DATA)
  const summary = useMemo(() => {
    let pending = 0;
    let approved = 0;

    for (const item of data) {
      if (item.approval_status === "pending") pending++;
      if (item.approval_status === "approved") approved++;
    }

    return { pending, approved };
  }, [data]);

  // filtered table
  const tableData = useMemo(() => {
    return data
      .filter((item) =>
        status === "pending"
          ? item.approval_status === "pending"
          : item.approval_status === "approved"
      )
      .map((item) => ({
        ...item,
        formattedDate: item.attendance_date,
        formattedCreatedAt: new Date(item.created_at).toLocaleDateString(),
        formattedRate: formatCurrency(item.hourly_rate),
      }));
  }, [data, status]);

  // ================= HANDLERS =================
  const handleReset = () => {
    setMonth("");
    setClassId("");
  };

  // ================= RENDER =================
  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Bảng lương cá nhân
        </h2>
        <p className="text-slate-500 mt-1">
          Theo dõi thu nhập từ các lớp học
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả lớp</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div
          onClick={() => setStatus("pending")}
          className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer transition-all ${
            status === "pending" ? "ring-2 ring-amber-300 scale-[1.02]" : ""
          }`}
        >
          <p className="text-amber-100 text-sm mb-1">Lương chờ duyệt</p>
          <p className="text-3xl font-bold">{summary.pending}</p>
        </div>

        <div
          onClick={() => setStatus("approved")}
          className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer transition-all ${
            status === "approved" ? "ring-2 ring-emerald-300 scale-[1.02]" : ""
          }`}
        >
          <p className="text-emerald-100 text-sm mb-1">
            Tổng lương đã duyệt
          </p>
          <p className="text-3xl font-bold">{summary.approved}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            Chi tiết chấm công
          </h3>

          {error && (
            <button
              onClick={fetchSalary}
              className="text-sm text-red-500 underline"
            >
              Thử lại
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Tên lớp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Ngày dạy
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Ngày chấm công
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Rate lương
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : tableData.length > 0 ? (
                tableData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.class_name}
                    </td>
                    <td className="px-6 py-4">{item.formattedDate}</td>
                    <td className="px-6 py-4">{item.attendance_time}</td>
                    <td className="px-6 py-4">{item.formattedCreatedAt}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {item.formattedRate}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`status-badge ${
                          item.approval_status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.approval_status === "approved"
                          ? "Đã duyệt"
                          : "Chờ duyệt"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    {error ?? "Không có dữ liệu"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}