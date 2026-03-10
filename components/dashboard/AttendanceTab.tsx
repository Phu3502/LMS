// components/dashboard/AttendanceTab.tsx
'use client';

import { useState } from 'react';

// Mock attendance records
const mockAttendance = [
  {
    __backendId: 'a1',
    class_id: '1',
    attendance_date: '2025-03-10',
    attendance_time: '19:00',
    teacher_notes: 'Buổi học tốt',
    approval_status: 'approved',
    payment_status: 'paid',
  },
  {
    __backendId: 'a2',
    class_id: '2',
    attendance_date: '2025-03-12',
    attendance_time: '18:30',
    teacher_notes: 'Học sinh chăm chỉ',
    approval_status: 'pending',
    payment_status: 'unpaid',
  },
];

// Mock classes (giống trên)
const mockClasses = [
  { __backendId: '1', class_id: 'MATH101', class_name: 'Toán 10' },
  { __backendId: '2', class_id: 'PHY201', class_name: 'Vật lý 11' },
];

export default function AttendanceTab() {
  const [attendanceRecords] = useState(mockAttendance);
  const [selectedClass, setSelectedClass] = useState('');
  const [attDate, setAttDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [attTime, setAttTime] = useState('19:00');
  const [attNotes, setAttNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi chấm công (mock)
    alert('Đã gửi chấm công (demo)');
    // Reset form
    setSelectedClass('');
    setAttDate(new Date().toISOString().split('T')[0]);
    setAttTime('19:00');
    setAttNotes('');
  };

  const getClassName = (classId: string) => {
    const cls = mockClasses.find(c => c.__backendId === classId);
    return cls ? `${cls.class_id} - ${cls.class_name}` : 'Lớp không xác định';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Chấm công</h2>
        <p className="text-slate-500 mt-1">Ghi nhận và theo dõi các buổi dạy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form gửi chấm công */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Gửi chấm công mới
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mã lớp</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
              >
                <option value="">Chọn lớp học</option>
                {mockClasses.map(cls => (
                  <option key={cls.__backendId} value={cls.__backendId}>
                    {cls.class_id} - {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ngày dạy</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thời gian</label>
                <input
                  type="time"
                  value={attTime}
                  onChange={(e) => setAttTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nhận xét của giáo viên</label>
              <textarea
                value={attNotes}
                onChange={(e) => setAttNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-900"
                placeholder="Ghi chú về buổi học..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Gửi chấm công
            </button>
          </form>
        </div>

        {/* Lịch sử chấm công */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lịch sử chấm công
          </h3>
          <div className="space-y-4 max-h-96 overflow-auto scrollbar-thin pr-2">
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">Chưa có lịch sử chấm công</p>
              </div>
            ) : (
              attendanceRecords.map(record => {
                const statusColor =
                  record.approval_status === 'approved' ? 'emerald' :
                  record.approval_status === 'rejected' ? 'red' : 'amber';
                const statusText =
                  record.approval_status === 'approved' ? 'Đã duyệt' :
                  record.approval_status === 'rejected' ? 'Từ chối' : 'Chờ duyệt';

                return (
                  <div key={record.__backendId} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-800">{getClassName(record.class_id)}</p>
                      </div>
                      <span className={`status-badge bg-${statusColor}-100 text-${statusColor}-700`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(record.attendance_date).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {record.attendance_time}
                      </span>
                    </div>
                    {record.teacher_notes && (
                      <p className="mt-2 text-sm text-slate-600 italic">"{record.teacher_notes}"</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}