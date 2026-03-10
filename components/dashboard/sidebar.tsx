// components/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 gradient-bg flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Coremath Academy</h1>
            <p className="text-blue-200 text-xs">Teacher Portal</p>
          </div>
        </div>
      </div>

      {/* Thông tin giáo viên */}
      <div className="p-4 border-b border-white/10">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <div>
              <p className="text-white font-semibold">Giáo Viên</p>
              <p className="text-blue-200 text-xs">Chào mừng trở lại!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'dashboard', label: 'Danh sách lớp', icon: 'M4 6a2...' },
          { id: 'calendar', label: 'Lịch dạy', icon: 'M8 7V3...' },
          { id: 'attendance', label: 'Chấm công', icon: 'M9 5H7...' },
          { id: 'salary', label: 'Bảng lương', icon: 'M12 8c-1.657...' },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'active text-white' : 'text-white/70'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Progress bar */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-xs">Buổi dạy tháng này</span>
            <span className="text-white font-bold">0</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}