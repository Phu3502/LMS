"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getColorById(id: string) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-orange-500",
  ];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

type ClassType = {
  id: string;
  name: string;
  time: string;
  startDate: Date | string;
  endDate: Date | string;
  teacherName?: string;
};

type Props = {
  classes: ClassType[];
  role: string;
};

export default function CalendarTab({ classes }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCells = () => {
    const cells = [];

    // ô trống đầu tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const current = new Date(year, month, day);
      const dayOfWeek = current.getDay();

      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // 🔥 LOGIC CHUẨN (KHÔNG BUG)
      const events = classes.filter((cls) => {
        if (!cls.startDate || !cls.endDate) return false;

        const start = new Date(cls.startDate);
        const end = new Date(cls.endDate);

        // ngoài khoảng thời gian → bỏ
        if (current < start || current > end) return false;

        // lấy thứ từ startDate (chuẩn 100%)
        return start.getDay() === dayOfWeek;
      });

      cells.push(
        <div
          key={day}
          className={`min-h-[110px] border rounded-xl p-2 transition ${
            isToday
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          {/* Day number */}
          <div
            className={`text-sm font-semibold ${
              isToday ? "text-blue-600" : "text-zinc-700"
            }`}
          >
            {day}
          </div>

          {/* Events */}
          <div className="mt-2 flex flex-col gap-1">
            {events.map((cls) => (
              <div
                key={cls.id}
                className={`rounded-md px-2 py-1 text-white text-xs shadow ${getColorById(
                  cls.id
                )}`}
              >
                <div className="font-medium truncate">{cls.name}</div>

                <div className="opacity-90 text-[11px]">
                  ⏰ {cls.time}
                </div>

                {cls.teacherName && (
                  <div className="opacity-80 text-[10px] truncate">
                    👨‍🏫 {cls.teacherName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft />
        </button>

        <h2 className="font-semibold text-lg text-zinc-800">
          {currentDate.toLocaleString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <ChevronRight />
        </button>
      </div>

      {/* WEEKDAY HEADER */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2 text-zinc-500">
        <div>CN</div>
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">
        {renderCells()}
      </div>
    </div>
  );
}