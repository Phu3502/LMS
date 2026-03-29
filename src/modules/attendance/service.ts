import { findAttendance } from "./repository";

export async function getAttendanceData(params: any) {
  const data = await findAttendance(params);

  const summary = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  for (const item of data) {
    if (item.approval_status === "pending") summary.pending++;
    if (item.approval_status === "approved") summary.approved++;
    if (item.approval_status === "rejected") summary.rejected++;
  }

  return { data, summary };
}