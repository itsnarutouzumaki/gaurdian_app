import * as Keychain from "react-native-keychain";
import { clearGetCache } from "../api/clear-get-cache";

const SESSION_SERVICE = "com.testinternational.guardian.auth";

export async function clearAuthSession(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SESSION_SERVICE });
  await clearGetCache();
}
