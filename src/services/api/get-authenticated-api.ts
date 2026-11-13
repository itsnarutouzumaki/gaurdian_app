import { authenticatedRequest } from "./authenticated-request";

export async function getAuthenticatedApi<T>(path: string): Promise<T> {
  return authenticatedRequest<T>(path, { method: "GET" });
}
