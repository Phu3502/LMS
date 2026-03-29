export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface AttendanceRecord {
  id: string;

  class_id: string;
  class_name: string;

  teacher_id: string;
  teacher_name: string;

  attendance_date: string;
  attendance_time: string;

  created_at: Date;

  approval_status: ApprovalStatus;
  teacher_notes?: string;

  rate: number;
}