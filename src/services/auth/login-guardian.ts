import { requestApi } from "../api/request-api";
import { storeAuthSession } from "../auth-session/store-auth-session";
import type { LoginGuardianResponse } from "./auth.types";
import { validateLoginResponse } from "./validate-login-response";

export async function loginGuardian(input: {
  phone: string;
  password: string;
}): Promise<LoginGuardianResponse> {
  const response = validateLoginResponse(await requestApi<unknown>(
    "/guardian/auth/login",
    {
      method: "POST",
      body: input,
    },
  ));
  if (response.passwordChangeRequired) return response;
  if (!response.refreshToken || !response.refreshExpiresAt) {
    throw new Error("Sign in couldn't be completed. Please try again.");
  }
  await storeAuthSession({
    userId: response.account.id,
    accessToken: response.accessToken,
    accessTokenExpiresAt: Date.now() + response.expiresIn * 1000,
    refreshToken: response.refreshToken,
    accessTokenExpiresIn: response.expiresIn,
    refreshExpiresAt: response.refreshExpiresAt,
  });
  return response;
}
