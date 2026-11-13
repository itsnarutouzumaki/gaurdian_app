import { ApiClientError } from "./api-client.error";
import type { ApiRequestOptions } from "./api.types";
import { requestApi } from "./request-api";
import { loadAuthSession } from "../auth-session/load-auth-session";
import { refreshGuardianSession } from "../auth/refresh-guardian-session";

export async function authenticatedRequest<T>(
  path: string,
  options: Omit<ApiRequestOptions, "accessToken" | "cacheScope">,
): Promise<T> {
  let session = await loadAuthSession();
  if (!session) {
    throw new ApiClientError({
      code: "UNAUTHENTICATED",
      status: 401,
      message: "Sign in to continue.",
    });
  }
  if (session.accessTokenExpiresAt <= Date.now() + 30_000) {
    session = await refreshGuardianSession();
  }
  try {
    return await requestApi<T>(path, {
      ...options,
      accessToken: session.accessToken,
      cacheScope: session.userId,
    });
  } catch (error) {
    if (
      !(error instanceof ApiClientError)
      || error.status !== 401
      || !["UNAUTHENTICATED", "SESSION_EXPIRED"].includes(error.code)
    ) {
      throw error;
    }
    session = await refreshGuardianSession();
    return requestApi<T>(path, {
      ...options,
      accessToken: session.accessToken,
      cacheScope: session.userId,
    });
  }
}
