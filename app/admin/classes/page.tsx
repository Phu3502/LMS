"use client";

import { useState } from "react";

export default function CreateClassPage() {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    await fetch("/api/classes", {
      method: "POST",
      body: JSON.stringify({
        name,
        teacherId: "USER_ID",
        weekday: "Tue",
        time: "18:00-19:30",
        startDate: "2025-01-01",
        endDate: "2025-03-01",
      }),
    });
  };

  return (
    <div className="p-6">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên lớp"
      />

      <button onClick={handleCreate}>Tạo lớp</button>
    </div>
  );
}