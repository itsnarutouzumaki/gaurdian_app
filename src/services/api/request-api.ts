import type { ApiRequestOptions } from "./api.types";
import { buildCacheKey } from "./build-cache-key";
import { clearGetCache } from "./clear-get-cache";
import { performApiRequest } from "./perform-api-request";
import { readGetCache } from "./read-get-cache";
import { writeGetCache } from "./write-get-cache";

export async function requestApi<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<T> {
  const method = options.method;
  if (method === "GET" && options.accessToken && !options.cacheScope) {
    throw new TypeError(
      "Authenticated GET requests require an account-specific cache scope.",
    );
  }
  const key = method === "GET"
    ? buildCacheKey(path, options.cacheScope ?? "public")
    : undefined;
  if (key) {
    const cached = await readGetCache<T>(key);
    if (cached) return cached.value;
  }

  const result = await performApiRequest<T>(path, options);
  if (key) await writeGetCache(key, result);
  if (method !== "GET") {
    try {
      await clearGetCache();
    } catch (error) {
      console.warn("The API cache could not be invalidated after a write.", error);
    }
  }
  return result;
}
