import { authenticatedRequest } from "./api/authenticated-request";

export async function createGuardianChildLinkRequest(input: {
  studentNumber: string;
  relationship?: string;
}) {
  await authenticatedRequest("/guardian/child-link-requests", {
    method: "POST",
    body: {
      studentNumber: input.studentNumber,
      ...(input.relationship ? { relationship: input.relationship } : {}),
    },
  });
}

export async function createGuardianComplaint(input: {
  childId: string;
  subject: string;
  message: string;
}) {
  await authenticatedRequest("/guardian/complaints", {
    method: "POST",
    body: input,
  });
}

export async function updateGuardianProfile(input: {
  fullName: string;
  address: string;
}) {
  await authenticatedRequest("/guardian/me", {
    method: "PATCH",
    body: input,
  });
}

export async function markGuardianNotificationRead(eventId: string) {
  await authenticatedRequest(
    `/guardian/notifications/${encodeURIComponent(eventId)}/read`,
    { method: "PATCH" },
  );
}

export async function markAllGuardianNotificationsRead() {
  await authenticatedRequest("/guardian/notifications/read-all", {
    method: "PATCH",
  });
}
