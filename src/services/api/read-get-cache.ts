import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GetCacheEntry } from "./api.types";

export async function readGetCache<T>(
  key: string,
): Promise<GetCacheEntry<T> | undefined> {
  const serialized = await AsyncStorage.getItem(key);
  if (!serialized) return undefined;
  try {
    const entry = JSON.parse(serialized) as GetCacheEntry<T>;
    if (
      typeof entry.expiresAt !== "number"
      || entry.expiresAt <= Date.now()
      || !("value" in entry)
    ) {
      await AsyncStorage.removeItem(key);
      return undefined;
    }
    return entry;
  } catch (error) {
    console.warn("Discarding an invalid API cache entry.", error);
    await AsyncStorage.removeItem(key);
    return undefined;
  }
}
