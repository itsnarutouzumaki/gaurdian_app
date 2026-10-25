import type { ScreenName } from "../types";
import { C } from "../theme";

export function getNotificationTarget(title: string): ScreenName {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("fee")) return "FeesReceipt";
  if (normalizedTitle.includes("leave")) return "LeaveRequest";
  if (normalizedTitle.includes("result")) return "Results";
  if (normalizedTitle.includes("complaint")) return "RaiseComplaint";
  return "ChildDashboard";
}

export function getNotificationAppearance(type: string) {
  switch (type) {
    case "request":
      return { backgroundColor: C.successSoft, color: C.success, icon: "↗" };
    case "complaint":
      return { backgroundColor: C.orangeSoft, color: C.orange, icon: "!" };
    case "fee":
      return { backgroundColor: C.purpleSoft, color: C.purple, icon: "₹" };
    case "result":
      return { backgroundColor: C.blueSoft, color: C.primary, icon: "▤" };
    default:
      return { backgroundColor: C.blueSoft, color: C.primary, icon: "i" };
  }
}
