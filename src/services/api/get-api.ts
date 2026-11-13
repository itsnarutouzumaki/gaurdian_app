import { requestApi } from "./request-api";

export async function getApi<T>(
  path: string,
  options: { accessToken?: string; cacheScope?: string } = {},
): Promise<T> {
  return requestApi<T>(path, { method: "GET", ...options });
}
