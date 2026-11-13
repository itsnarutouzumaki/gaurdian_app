import { API_BASE_URL, API_VERSION_PATH } from "../../config/api";
import { ApiClientError } from "./api-client.error";

export function buildApiUrl(path: string): string {
  if (!API_BASE_URL.trim()) {
    throw new ApiClientError({
      code: "API_NOT_CONFIGURED",
      message: "Please try again later.",
    });
  }
  const origin = API_BASE_URL.trim().replace(/\/+$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${API_VERSION_PATH}${endpoint}`;
}
