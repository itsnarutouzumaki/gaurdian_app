import { requestApi } from "../api/request-api";

export async function changeRequiredPassword(input: {
  accessToken: string;
  newPassword: string;
}): Promise<void> {
  await requestApi<void>("/guardian/auth/password/change", {
    method: "POST",
    body: { newPassword: input.newPassword },
    accessToken: input.accessToken,
  });
}
