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
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-rose-500",
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

  const uniqueClasses = [
    ...new Map(classes.map((c) => [c.id, c])).values(),
  ];

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
        if (!cls.startDate || !cls.endDate) return false;

        const start = new Date(cls.startDate);
        const end = new Date(cls.endDate);

        if (current < start || current > end) return false;

        return start.getDay() === dayOfWeek;
      });

      cells.push(
        <div
          key={day}
          className={`min-h-[80px] sm:min-h-[110px] border rounded-xl p-1.5 sm:p-2 
          transition-all duration-200 cursor-pointer active:scale-[0.98]
          ${
            isToday
              ? "bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-400"
              : "bg-white hover:bg-slate-50"
          }`}
        >
          {/* DAY */}
          <div
            className={`text-[11px] sm:text-sm font-semibold mb-1 ${
              isToday ? "text-blue-600" : "text-zinc-700"
            }`}
          >
            {day}
          </div>

          {/* EVENTS */}
          <div className="flex flex-col gap-1">
            {/* MOBILE DOT */}
            <div className="flex flex-wrap gap-1 sm:hidden">
              {events.slice(0, 4).map((cls) => (
                <div
                  key={cls.id}
                  className={`w-2.5 h-2.5 rounded-full shadow-sm 
                  ring-1 ring-white transition-transform duration-150
                  ${getColorById(cls.id)}`}
                />
              ))}

              {events.length > 4 && (
                <div className="text-[9px] text-zinc-500">
                  +{events.length - 4}
                </div>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:flex sm:flex-col sm:gap-1">
              {events.slice(0, 2).map((cls) => (
                <div
                  key={cls.id}
                  className={`rounded-md px-1.5 py-1 text-white text-xs 
                  shadow-sm truncate ${getColorById(cls.id)}`}
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

              {events.length > 2 && (
                <div className="text-[11px] text-zinc-500">
                  +{events.length - 2} nữa
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="p-3 sm:p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition text-zinc-700"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="font-semibold text-base sm:text-lg text-center text-zinc-800">
          {currentDate.toLocaleString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition text-zinc-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* MOBILE LEGEND */}
      <div className="sm:hidden mb-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 w-max px-1">
          {uniqueClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center gap-1.5 text-[11px] whitespace-nowrap 
              bg-white px-2 py-1 rounded-full shadow-sm border"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${getColorById(cls.id)}`}
              />
              <span className="text-zinc-700">{cls.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKDAY */}
      <div className="grid grid-cols-7 text-[11px] sm:text-sm font-medium text-center text-zinc-500 mb-1 sm:mb-2">
        <div>CN</div>
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {renderCells()}
      </div>
    </div>
  );
}