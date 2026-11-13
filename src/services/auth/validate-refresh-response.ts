export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresAt: string;
};

export function validateRefreshResponse(value: unknown): RefreshResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("Your session has ended. Please sign in again.");
  }
  const response = value as RefreshResponse;
  if (
    typeof response.accessToken !== "string"
    || typeof response.refreshToken !== "string"
    || !Number.isFinite(response.expiresIn)
    || response.expiresIn <= 0
    || typeof response.refreshExpiresAt !== "string"
    || !Number.isFinite(Date.parse(response.refreshExpiresAt))
  ) {
    throw new Error("Your session has ended. Please sign in again.");
  }
  return response;
}
