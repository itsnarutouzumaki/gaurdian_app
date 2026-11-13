import { authenticatedRequest } from "../api/authenticated-request";
import type { GuardianBootstrap } from "./guardian-bootstrap.types";

export async function getGuardianBootstrap() {
  const snapshot = await authenticatedRequest<GuardianBootstrap>(
    "/guardian/bootstrap",
    { method: "GET" },
  );
  if (
    typeof snapshot !== "object"
    || snapshot === null
    || !Array.isArray(snapshot.children)
    || !Array.isArray(snapshot.notifications)
    || !Array.isArray(snapshot.complaints)
    || !Array.isArray(snapshot.leaveRequests)
    || !Array.isArray(snapshot.childLinkRequests)
    || !snapshot.account
    || snapshot.account.role !== "guardian"
  ) {
    throw new Error("We couldn't load your information. Please try again.");
  }
  return snapshot;
}
