import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

export type PushRegistrationResult =
  | { status: "not-configured" }
  | { status: "unsupported-in-expo-go" }
  | { status: "permission-denied" }
  | { status: "registered" };

export async function configurePushChannel(): Promise<void> {
  if (isRunningInExpoGo()) return;
  const Notifications = await import("expo-notifications");
  await Notifications.setNotificationChannelAsync("default", {
    name: "General",
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function registerPushTokenWithBackend({
  apiBaseUrl,
  accessToken,
}: {
  apiBaseUrl?: string;
  accessToken?: string;
}): Promise<PushRegistrationResult> {
  if (!apiBaseUrl) return { status: "not-configured" };
  if (isRunningInExpoGo()) return { status: "unsupported-in-expo-go" };
  if (!accessToken?.trim()) {
    throw new Error("Push registration requires an authenticated access token.");
  }
  if (Platform.OS !== "android" && Platform.OS !== "ios") {
    throw new Error("Push token registration is supported only on Android and iOS.");
  }

  const base = new URL(apiBaseUrl);
  if (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname)) {
    throw new Error("Push registration requires HTTPS outside local development.");
  }

  const Notifications = await import("expo-notifications");
  const permission = await Notifications.getPermissionsAsync();
  const requested = permission.granted
    ? permission
    : await Notifications.requestPermissionsAsync();
  if (!requested.granted) return { status: "permission-denied" };

  const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
  const response = await fetch(new URL("/v1/device-tokens", base), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: expoPushToken, platform: Platform.OS }),
  });
  if (!response.ok) {
    throw new Error(`Push token registration failed with HTTP ${response.status}.`);
  }
  return { status: "registered" };
}
