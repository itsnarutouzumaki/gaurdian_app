import { ApiClientError } from "./api-client.error";
import type { ApiErrorEnvelope } from "./api.types";

export function createApiError(
  payload: unknown,
  status: number,
): ApiClientError {
  const error = payload as ApiErrorEnvelope;
  return new ApiClientError({
    code: error?.error?.code ?? "API_REQUEST_FAILED",
    message: error?.error?.message ?? `The request failed (${status}).`,
    status,
    requestId: error?.error?.requestId,
    retryable: error?.error?.retryable,
  });
}
