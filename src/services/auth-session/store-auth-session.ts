import * as Keychain from "react-native-keychain";
import type { AuthSession } from "./auth-session.types";

const SESSION_SERVICE = "com.testinternational.guardian.auth";

export async function storeAuthSession(session: AuthSession): Promise<void> {
  const result = await Keychain.setGenericPassword(
    session.userId,
    JSON.stringify(session),
    { service: SESSION_SERVICE },
  );
  if (!result) throw new Error("Couldn't save your sign-in details. Please try again.");
}
