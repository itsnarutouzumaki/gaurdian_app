import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_CACHE_TTL_MS } from "../../config/api";
import type { GetCacheEntry } from "./api.types";

export async function writeGetCache<T>(key: string, value: T): Promise<void> {
  const entry: GetCacheEntry<T> = {
    value,
    expiresAt: Date.now() + GET_CACHE_TTL_MS,
  };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}
