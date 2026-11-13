import { ApiClientError } from "../api/api-client.error";
import { requestApi } from "../api/request-api";
import { clearAuthSession } from "../auth-session/clear-auth-session";
import { loadAuthSession } from "../auth-session/load-auth-session";
import { storeAuthSession } from "../auth-session/store-auth-session";
import { validateRefreshResponse } from "./validate-refresh-response";

export async function performGuardianSessionRefresh() {
  const session = await loadAuthSession();
  if (!session) {
    throw new ApiClientError({
      code: "UNAUTHENTICATED",
      status: 401,
      message: "Sign in again to continue.",
    });
  }
  try {
    const refreshed = validateRefreshResponse(await requestApi<unknown>(
      "/guardian/auth/refresh",
      { method: "POST", body: { refreshToken: session.refreshToken } },
    ));
    const updatedSession = {
      ...session,
      accessToken: refreshed.accessToken,
      accessTokenExpiresAt: Date.now() + refreshed.expiresIn * 1000,
      refreshToken: refreshed.refreshToken,
      refreshExpiresAt: refreshed.refreshExpiresAt,
    };
    await storeAuthSession(updatedSession);
    return updatedSession;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      await clearAuthSession();
    }
    throw error;
  }
}
