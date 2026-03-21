"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getColorById(id: string) {
  const colors = [
    "bg-yellow-500",
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
  weekday: string;
  time: string;
  startDate: Date | string;
  endDate: Date | string;
};

type Props = {
  classes: ClassType[];
};

export default function CalendarTab({ classes }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

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

      const events = classes.filter((cls) => {
        if (!cls.weekday || !cls.startDate || !cls.endDate) return false;

        const classDay = weekdayMap[cls.weekday];
        if (classDay !== dayOfWeek) return false;

        const start = new Date(cls.startDate);
        const end = new Date(cls.endDate);

        return current >= start && current <= end;
      });

      cells.push(
        <div
          key={day}
          className={`min-h-[100px] border rounded-lg p-2 ${
            isToday ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? "text-white" : ""}`}>{day}</div>

          <div className="mt-2 flex flex-col gap-1">
            {events.map((cls) => (
              <div
                key={cls.id}
                className={`text-xs px-2 py-1 rounded text-white ${getColorById(cls.id)}`}
              >
                {cls.name} ({cls.time})
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
      <div className="flex items-center justify-between mb-4 text-zinc-700">
        <button onClick={prevMonth}>
          <ChevronLeft />
        </button>

        <h2 className="font-semibold text-lg text-zinc-700">
          {currentDate.toLocaleString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button onClick={nextMonth}>
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2 text-zinc-600">
        <div>Chủ nhật</div>
        <div>Thứ Hai</div>
        <div>Thứ Ba</div>
        <div>Thứ Tư</div>
        <div>Thứ Năm</div>
        <div>Thứ Sáu</div>
        <div>Thứ Bảy</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-zinc-700">
        {renderCells()}
      </div>

      {/* <div className="mt-6 flex flex-wrap gap-2">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`text-xs px-2 py-1 rounded-full text-white ${getColorById(cls.id)}`}
          >
            {cls.name}
          </div>
        ))}
      </div> */}
    </div>
  );
}