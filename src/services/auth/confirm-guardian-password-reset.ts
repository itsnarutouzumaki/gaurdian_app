import { requestApi } from "../api/request-api";
import { clearAuthSession } from "../auth-session/clear-auth-session";

export async function confirmGuardianPasswordReset(input: {
  challengeId: string;
  verificationCode: string;
  newPassword: string;
}): Promise<void> {
  await requestApi<void>("/guardian/auth/password-reset/confirmations", {
    method: "POST",
    body: input,
  });
  await clearAuthSession();
}
