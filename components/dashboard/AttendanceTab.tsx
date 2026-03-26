'use client';

import { useEffect, useState } from 'react';

type AttendanceRecord = {
  id: string;
  class_id: string;
  class_name?: string;
  attendance_date: string;
  attendance_time: string;
  teacher_notes?: string;
  approval_status: 'approved' | 'pending' | 'rejected';
  teacher_name?: string;
  created_at?: string;
};

type ClassItem = {
  id: string;
  name: string;
};

export default function AttendanceTab() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attTime, setAttTime] = useState('19:00');
  const [attNotes, setAttNotes] = useState('');

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const statusMap: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, classRes, sessionRes] = await Promise.all([
          fetch('/api/attendance'),
          fetch('/api/classes'),
          fetch('/api/auth/get-session'),
        ]);

        const attData = await attRes.json();
        const classData = await classRes.json();
        const session = await sessionRes.json();

        setAttendanceRecords(attData);
        setClasses(classData);

        if (session?.user?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ================= SUBMIT (TEACHER) =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        class_id: selectedClass,
        attendance_date: attDate,
        attendance_time: attTime,
        teacher_notes: attNotes,
      }),
    });

    const newRecord = await res.json();
    setAttendanceRecords(prev => [newRecord, ...prev]);

    setSelectedClass('');
    setAttDate(new Date().toISOString().split('T')[0]);
    setAttTime('19:00');
    setAttNotes('');
  };

  // ================= ADMIN ACTION =================
  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedRecord) return;

    await fetch('/api/attendance', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedRecord.id,
        status,
        note: adminNote,
      }),
    });

    setAttendanceRecords(prev =>
      prev.filter(r => r.id !== selectedRecord.id)
    );

    setSelectedRecord(null);
    setAdminNote('');
  };

  // ================= HELPERS =================
  const formatDate = (date?: string) => {
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('vi-VN');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Chấm công</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ❌ ADMIN KHÔNG CÓ FORM */}
        {!isAdmin && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Chọn lớp</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="time"
                value={attTime}
                onChange={(e) => setAttTime(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                value={attNotes}
                onChange={(e) => setAttNotes(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />

              <button className="w-full bg-blue-600 text-white p-3 rounded-xl">
                Gửi chấm công
              </button>
            </form>
          </div>
        )}

        {/* ================= LIST ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 col-span-1 lg:col-span-2">
          {attendanceRecords.map(record => (
            <div
              key={record.id}
              onClick={() => isAdmin && setSelectedRecord(record)}
              className={`p-4 mb-4 rounded-xl border bg-slate-50 cursor-pointer hover:shadow ${
                isAdmin ? 'hover:bg-slate-100' : ''
              }`}
            >
              <div className="flex justify-between">
                <p className="font-semibold text-slate-900">
                  {record.class_name}
                </p>

                <span className={`px-2 py-1 text-xs rounded ${statusMap[record.approval_status]}`}>
                  {record.approval_status}
                </span>
              </div>

              <p className="text-sm text-slate-700">
                {formatDate(record.attendance_date)} - {record.attendance_time}
              </p>

              {record.teacher_name && (
                <p className="text-xs text-slate-500">
                  GV: {record.teacher_name}
                </p>
              )}

              {record.created_at && (
                <p className="text-xs text-slate-500">
                  Gửi lúc: {formatDateTime(record.created_at)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ADMIN ================= */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 text-zinc-900">
            <h3 className="font-bold text-lg">Xử lý chấm công</h3>

            <textarea
              placeholder="Lý do (nếu từ chối)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-3 border rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleAction('approved')}
                className="flex-1 bg-green-600 text-white p-2 rounded"
              >
                Duyệt
              </button>

              <button
                onClick={() => handleAction('rejected')}
                className="flex-1 bg-red-600 text-white p-2 rounded"
              >
                Từ chối
              </button>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full text-sm text-gray-500"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}