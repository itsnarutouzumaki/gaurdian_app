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
    throw new Error("Push registration requires an authenticated access token.");
  }
  if (!deviceToken?.trim()) {
    throw new Error("Push registration requires a native device token.");
  }

  const base = new URL(apiBaseUrl);
  if (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname)) {
    throw new Error("Push registration requires HTTPS outside local development.");
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
    throw new Error(`Push token registration failed with HTTP ${response.status}.`);
  }
  return { status: "registered" };
}
