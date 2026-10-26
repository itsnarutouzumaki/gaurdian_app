import type { ScreenName } from "../types";

export type HardwareBackDecision = "dismiss-modal" | "pop" | "home" | "exit";

export function getHardwareBackDecision({
  stackLength,
  route,
  authenticated,
  modalVisible,
}: {
  stackLength: number;
  route: ScreenName;
  authenticated: boolean;
  modalVisible: boolean;
}): HardwareBackDecision {
  if (modalVisible) return "dismiss-modal";
  if (stackLength > 1) return "pop";
  if (authenticated && route !== "Home") return "home";
  if (!authenticated && route === "Splash") return "home";
  return "exit";
}
