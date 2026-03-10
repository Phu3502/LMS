// components/dashboard/AddClassModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

interface AddClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddClassModal({ open, onOpenChange }: AddClassModalProps) {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm lớp (tạm thời đóng modal)
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm lớp học mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mã lớp</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: MATH101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tên lớp</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Toán 10"
              />
            </div>
          </div>
          {/* ... các trường khác giống HTML ... */}

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Màu hiển thị</label>
            <div className="flex gap-3">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    selectedColor === color ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color, '--tw-ring-color': color } as any}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Thêm lớp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}