'use client';

import { useState } from 'react';

// ================= TYPES =================
type AttendanceRecord = {
  id: string;
  class_id: string;
  class_name?: string | null;
  attendance_date: string;
  attendance_time: string;
  teacher_notes?: string | null;
  approval_status: 'approved' | 'pending' | 'rejected';
  teacher_name?: string | null;
  created_at?: Date;
};

type ClassItem = {
  id: string;
  name: string;
};

type Props = {
  data: AttendanceRecord[];
  classes: ClassItem[];
  isAdmin: boolean;
};

// ================= COMPONENT =================
export default function AttendanceTab({ data, classes, isAdmin }: Props) {
  const [attendanceRecords, setAttendanceRecords] = useState(data);

  const [selectedClass, setSelectedClass] = useState('');
  const [attDate, setAttDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attTime, setAttTime] = useState('19:00');
  const [attNotes, setAttNotes] = useState('');

  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceRecord | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const statusMap: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  // ================= SUBMIT =================
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

  const formatDateTime = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('vi-VN');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Chấm công</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* FORM */}
        {!isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border rounded"
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
                className="w-full p-3 border rounded"
              />

              <input
                type="time"
                value={attTime}
                onChange={(e) => setAttTime(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <textarea
                value={attNotes}
                onChange={(e) => setAttNotes(e.target.value)}
                className="w-full p-3 border rounded"
              />

              <button className="w-full bg-blue-600 text-white p-3 rounded">
                Gửi chấm công
              </button>
            </form>
          </div>
        )}

        {/* LIST */}
        <div className="bg-white p-6 rounded-xl shadow col-span-1 lg:col-span-2">
          {attendanceRecords.map(record => (
            <div
              key={record.id}
              onClick={() => isAdmin && setSelectedRecord(record)}
              className="p-4 mb-4 border rounded hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex justify-between">
                <p>{record.class_name}</p>
                <span className={`px-2 py-1 text-xs rounded ${statusMap[record.approval_status]}`}>
                  {record.approval_status}
                </span>
              </div>

              <p>
                {formatDate(record.attendance_date)} - {record.attendance_time}
              </p>

              {record.teacher_name && <p>GV: {record.teacher_name}</p>}

              {record.created_at && (
                <p>{formatDateTime(record.created_at)}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-2 border"
            />

            <div className="flex gap-2 mt-4">
              <button onClick={() => handleAction('approved')}>
                Duyệt
              </button>
              <button onClick={() => handleAction('rejected')}>
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}