import { API_BASE_URL, SCHOOL_CODE } from "../../config/api";

export function buildCacheKey(path: string, scope: string): string {
  return `@test-international/api-cache/${API_BASE_URL}/${SCHOOL_CODE}/${scope}/${path}`;
}
