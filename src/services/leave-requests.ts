import { authenticatedRequest } from "./api/authenticated-request";

export type LeaveRequestSubmission = {
  childId: string;
  startDate: string;
  endDate: string;
  reason: string;
  password: string;
};

export async function submitLeaveRequest(
  submission: LeaveRequestSubmission,
): Promise<void> {
  await authenticatedRequest("/guardian/leave-requests", {
    method: "POST",
    body: {
      childId: submission.childId,
      startsOn: submission.startDate,
      endsOn: submission.endDate,
      reason: submission.reason,
      password: submission.password,
      fileIds: [],
    },
  });
}
