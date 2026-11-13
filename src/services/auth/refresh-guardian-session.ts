import type { AuthSession } from "../auth-session/auth-session.types";
import { performGuardianSessionRefresh } from "./perform-guardian-session-refresh";

let refreshTask: Promise<AuthSession> | undefined;

export async function refreshGuardianSession(): Promise<AuthSession> {
  if (refreshTask) return refreshTask;
  const task = performGuardianSessionRefresh();
  refreshTask = task;
  try {
    return await task;
  } finally {
    if (refreshTask === task) refreshTask = undefined;
  }
}
