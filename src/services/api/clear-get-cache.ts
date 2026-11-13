import AsyncStorage from "@react-native-async-storage/async-storage";

const API_CACHE_PREFIX = "@test-international/api-cache/";

export async function clearGetCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(API_CACHE_PREFIX));
  if (cacheKeys.length) await AsyncStorage.multiRemove(cacheKeys);
}
