import * as Keychain from "react-native-keychain";
import type { AuthSession } from "./auth-session.types";

const SESSION_SERVICE = "com.testinternational.guardian.auth";

export async function loadAuthSession(): Promise<AuthSession | undefined> {
  const credentials = await Keychain.getGenericPassword({ service: SESSION_SERVICE });
  if (!credentials) return undefined;
  try {
    const session = JSON.parse(credentials.password) as AuthSession;
    if (
      typeof session.userId !== "string"
      || typeof session.accessToken !== "string"
      || !Number.isFinite(session.accessTokenExpiresAt)
      || typeof session.refreshToken !== "string"
      || !Number.isFinite(session.accessTokenExpiresIn)
      || typeof session.refreshExpiresAt !== "string"
      || !Number.isFinite(Date.parse(session.refreshExpiresAt))
    ) {
      throw new Error("Please sign in again.");
    }
    return session;
  } catch (error) {
    await Keychain.resetGenericPassword({ service: SESSION_SERVICE });
    throw error;
  }
}
