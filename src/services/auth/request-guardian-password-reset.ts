import { requestApi } from "../api/request-api";
import type { PasswordResetRequestResponse } from "./auth.types";

export async function requestGuardianPasswordReset(
  phone: string,
): Promise<PasswordResetRequestResponse> {
  const response = await requestApi<unknown>(
    "/guardian/auth/password-reset/requests",
    {
      method: "POST",
      body: { appAudience: "guardian", phone },
    },
  );
  const result = response as Record<string, unknown> | null;
  if (
    result === null
    || typeof result !== "object"
    || typeof result.challengeId !== "string"
    || typeof result.expiresIn !== "number"
    || !Number.isFinite(result.expiresIn)
    || result.expiresIn <= 0
    || typeof result.message !== "string"
  ) {
    throw new Error("Couldn't reset your password. Please try again.");
  }
  return {
    challengeId: result.challengeId,
    expiresIn: result.expiresIn,
    message: result.message,
  };
}
