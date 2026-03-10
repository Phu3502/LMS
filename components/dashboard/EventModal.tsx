// components/dashboard/EventModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: { classId: string; dateStr: string } | null;
  classes: any[]; // Kiểu Class
}

export default function EventModal({ open, onOpenChange, eventData, classes }: EventModalProps) {
  if (!eventData) return null;

  const cls = classes.find(c => c.__backendId === eventData.classId);
  if (!cls) return null;

  const remaining = cls.total_sessions - cls.completed_sessions;
  const schedule = cls.schedule;
  const timeMatch = schedule.match(/(\d{1,2}:\d{2})/);
  const time = timeMatch ? timeMatch[1] : '19:00';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  const handleQuickAttendance = () => {
    // Chuyển sang tab chấm công với thông tin đã điền sẵn (có thể dùng context hoặc router)
    alert('Chuyển đến form chấm công với thông tin buổi học này (demo)');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết buổi học</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-12 rounded" style={{ background: cls.color }} />
            <div>
              <p className="font-bold text-slate-800 text-lg">{cls.class_name}</p>
              <p className="text-slate-500 text-sm">{cls.class_id}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-slate-700">{formatDate(eventData.dateStr)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-700">{time}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-slate-700">
                Còn <span className={`font-bold ${remaining <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>{remaining}</span> buổi
              </span>
            </div>
          </div>
          <button
            onClick={handleQuickAttendance}
            className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Chấm công buổi này
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}