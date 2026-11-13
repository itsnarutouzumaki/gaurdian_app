import type { LoginGuardianResponse } from "./auth.types";

export function validateLoginResponse(
  value: unknown,
): LoginGuardianResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("Sign in couldn't be completed. Please try again.");
  }
  const response = value as LoginGuardianResponse;
  if (
    typeof response.accessToken !== "string"
    || typeof response.account?.id !== "string"
    || response.account.role !== "guardian"
    || !Number.isFinite(response.expiresIn)
    || response.expiresIn <= 0
    || typeof response.passwordChangeRequired !== "boolean"
  ) {
    throw new Error("Sign in couldn't be completed. Please try again.");
  }
  if (!response.passwordChangeRequired && (
    typeof response.refreshToken !== "string"
    || typeof response.refreshExpiresAt !== "string"
    || !Number.isFinite(Date.parse(response.refreshExpiresAt))
  )) {
    throw new Error("Sign in couldn't be completed. Please try again.");
  }
  return response;
}
