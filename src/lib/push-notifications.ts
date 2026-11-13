export type PushRegistrationResult =
  | { status: "not-configured" }
  | { status: "registered" };

export async function registerPushTokenWithBackend({
  apiBaseUrl,
  accessToken,
  deviceToken,
  platform,
}: {
  apiBaseUrl?: string;
  accessToken?: string;
  deviceToken?: string;
  platform: "android" | "ios";
}): Promise<PushRegistrationResult> {
  if (!apiBaseUrl) return { status: "not-configured" };
  if (!accessToken?.trim()) {
    throw new Error("Could not enable notifications. Please try again.");
  }
  if (!deviceToken?.trim()) {
    throw new Error("Could not enable notifications on this device.");
  }

  const base = new URL(apiBaseUrl);
  if (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname)) {
    throw new Error("Could not enable notifications. Please try again.");
  }

  const response = await fetch(new URL("/v1/device-tokens", base).toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: deviceToken, platform }),
  });
  if (!response.ok) {
    throw new Error("Could not enable notifications. Please try again.");
  }
  return { status: "registered" };
}
