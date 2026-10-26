import type { LeaveRequestRecord } from "../types";

export type LeaveRequestSubmission = {
  childId: string;
  startDate: string;
  endDate: string;
  reason: string;
  password: string;
};

export async function submitLeaveRequest(
  _submission: LeaveRequestSubmission,
): Promise<LeaveRequestRecord> {
  throw new Error("Leave request service is not configured.");
}
