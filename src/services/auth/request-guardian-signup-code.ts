import { requestApi } from "../api/request-api";
import type { SignupCodeResponse } from "./auth.types";

export async function requestGuardianSignupCode(
  phone: string,
): Promise<SignupCodeResponse> {
  const response = await requestApi<unknown>(
    "/guardian/auth/signup/verification-codes",
    { method: "POST", body: { phone } },
  );
  const result = response as Record<string, unknown> | null;
  if (
    result === null
    || typeof result !== "object"
    || typeof result.challengeId !== "string"
    || typeof result.expiresIn !== "number"
    || !Number.isFinite(result.expiresIn)
    || result.expiresIn <= 0
  ) {
    throw new Error("Couldn't send the verification code. Please try again.");
  }
  return {
    challengeId: result.challengeId,
    expiresIn: result.expiresIn,
  };
}
