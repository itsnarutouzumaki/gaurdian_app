import type { ScreenName } from "../types";

const pushRoutes = new Set<ScreenName>([
  "Notifications",
  "Home",
  "ChildDashboard",
  "Attendance",
  "Results",
  "FeesReceipt",
  "LeaveRequest",
  "RaiseComplaint",
]);

export type PushTapPayload = {
  route: ScreenName;
  childId?: string;
};

export function parsePushTapPayload(data: unknown): PushTapPayload | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.route !== "string" || !pushRoutes.has(record.route as ScreenName)) {
    return null;
  }
  if (record.childId !== undefined && typeof record.childId !== "string") {
    return null;
  }
  return {
    route: record.route as ScreenName,
    ...(typeof record.childId === "string" ? { childId: record.childId } : {}),
  };
}
