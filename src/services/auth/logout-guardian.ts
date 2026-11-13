import { requestApi } from "../api/request-api";
import { clearAuthSession } from "../auth-session/clear-auth-session";
import { loadAuthSession } from "../auth-session/load-auth-session";
import { refreshGuardianSession } from "./refresh-guardian-session";

export async function logoutGuardian(): Promise<void> {
  const session = await loadAuthSession();
  try {
    if (session) {
      const current = await refreshGuardianSession();
      await requestApi<void>("/guardian/auth/logout", {
        method: "POST",
        body: { allDevices: false },
        accessToken: current.accessToken,
      });
    }
  } finally {
    await clearAuthSession();
  }
}
