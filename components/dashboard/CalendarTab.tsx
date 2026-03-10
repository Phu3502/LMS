// components/dashboard/CalendarTab.tsx
'use client';

import { useState } from 'react';
import EventModal from './EventModal';

// Mock classes data (giống ở DashboardTab để đồng bộ)
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
  {
    __backendId: '2',
    class_id: 'PHY201',
    class_name: 'Vật lý 11',
    total_sessions: 30,
    completed_sessions: 20,
    rate_per_session: 350000,
    schedule: 'T2, T4, T6 - 18:30',
    color: '#10b981',
  },
];

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<{ classId: string; dateStr: string } | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const classes = mockClasses; // sau này thay bằng useDashboard()

  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const openEventModal = (classId: string, dateStr: string) => {
    setSelectedEvent({ classId, dateStr });
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Tạo lịch đơn giản (chỉ hiển thị các ô, bạn có thể cải tiến sau)
  const renderCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let cells = [];
    // Ô trống đầu tháng
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell border border-slate-100 bg-slate-50/50 p-2" />);
    }

    // Các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const dayOfWeek = new Date(year, month, day).getDay();
      const isSunday = dayOfWeek === 0;

      // Tìm sự kiện theo lịch cố định (giả lập: các lớp có schedule chứa thứ)
      const dayMap: { [key: number]: string } = { 0: 'cn', 1: 't2', 2: 't3', 3: 't4', 4: 't5', 5: 't6', 6: 't7' };
      const events = classes.filter(cls =>
        cls.schedule.toLowerCase().includes(dayMap[dayOfWeek])
      );

      cells.push(
        <div
          key={day}
          className={`calendar-cell border border-slate-100 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'} hover:bg-slate-50 transition-colors`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-medium ${isSunday ? 'text-red-500' : 'text-slate-700'} ${
                isToday ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''
              }`}
            >
              {day}
            </span>
          </div>
          <div className="space-y-1">
            {events.map(cls => {
              const remaining = cls.total_sessions - cls.completed_sessions;
              return (
                <div
                  key={cls.__backendId}
                  className="event-pill text-white truncate"
                  style={{ background: cls.color }}
                  onClick={() => openEventModal(cls.__backendId, dateStr)}
                >
                  {cls.class_id} ({remaining})
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Ô trống cuối tháng
    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`empty-end-${i}`} className="calendar-cell border border-slate-100 bg-slate-50/50 p-2" />);
    }

    return cells;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lịch dạy cá nhân</h2>
          <p className="text-slate-500 mt-1">Xem lịch và quản lý các buổi học</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === v ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {v === 'month' ? 'Tháng' : v === 'week' ? 'Tuần' : 'Ngày'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Điều hướng tháng */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrev} className="p-2 rounded-xl hover:bg-slate-200 transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
        </h3>
        <button onClick={handleNext} className="p-2 rounded-xl hover:bg-slate-200 transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grid lịch */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tiêu đề các ngày */}
        <div className="grid grid-cols-7 bg-slate-50 border-b">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, idx) => (
            <div key={day} className={`p-4 text-center text-sm font-semibold ${idx === 0 ? 'text-red-500' : 'text-slate-600'}`}>
              {day}
            </div>
          ))}
        </div>
        {/* Grid cells */}
        <div className="grid grid-cols-7">{renderCalendarCells()}</div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {classes.map(cls => (
          <div key={cls.__backendId} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: cls.color }} />
            <span className="text-sm text-slate-600">{cls.class_id} - {cls.class_name}</span>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      <EventModal
        open={showEventModal}
        onOpenChange={setShowEventModal}
        eventData={selectedEvent}
        classes={classes}
      />
    </div>
  );
}