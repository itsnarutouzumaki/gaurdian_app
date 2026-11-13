import { requestApi } from "../api/request-api";

export async function registerGuardian(input: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  challengeId: string;
  verificationCode: string;
}): Promise<{ guardianId: string; status: "active" }> {
  const response = await requestApi<unknown>(
    "/guardian/auth/signup",
    { method: "POST", body: input },
  );
  const result = response as Record<string, unknown> | null;
  if (
    result === null
    || typeof result !== "object"
    || typeof result.guardianId !== "string"
    || result.status !== "active"
  ) {
    throw new Error("Couldn't create your account. Please try again.");
  }
  return { guardianId: result.guardianId, status: "active" };
}
