// components/dashboard/DashboardTab.tsx
'use client';

import { useState } from 'react';
import AddClassModal from './AddClassModal';
import { Logout } from '../logout';


// Mock data để test giao diện
const mockClasses = [
  {
    __backendId: '1',
    class_id: 'MATH101',
    class_name: 'Toán 10',
    total_sessions: 24,
    completed_sessions: 12,
    rate_per_session: 300000,
    schedule: 'T3, T5, T7 - 19:00',
    color: '#3b82f6',
  },
  // thêm các lớp khác...
];

export default function DashboardTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const classes = mockClasses; // sau này sẽ lấy từ context hoặc props

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Danh sách lớp học</h2>
          <Logout />
        </div>
        <p className="text-slate-500 mt-1">Quản lý các lớp bạn đang phụ trách</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Copy 4 thẻ stat từ HTML, thay số liệu cứng bằng biến */}
        <div className="stat-card card-gradient rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Tổng lớp dạy</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{classes.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              {/* icon */}
            </div>
          </div>
        </div>
        {/* ... các stat khác */}
      </div>

      {/* Nút thêm lớp */}

      <div className="flex justify-end mb-6">
        {/* <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm lớp mới
        </button> */}
      </div>

      {/* Grid lớp học */}
      {classes.length === 0 ? (
        <div className="text-center py-16">
          {/* empty state */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const remaining = cls.total_sessions - cls.completed_sessions;
            const progress = (cls.completed_sessions / cls.total_sessions) * 100;
            const isCompleted = remaining <= 0;
            return (
              <div key={cls.__backendId} className="card-gradient rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
                {/* Copy HTML card và thay dữ liệu động */}
                <div className="h-2" style={{ background: cls.color }} />
                <div className="p-6">
                  {/* ... */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AddClassModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}