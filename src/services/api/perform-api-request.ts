import { API_REQUEST_TIMEOUT_MS, SCHOOL_CODE } from "../../config/api";
import { ApiClientError } from "./api-client.error";
import type { ApiErrorEnvelope, ApiRequestOptions } from "./api.types";
import { buildApiUrl } from "./build-api-url";
import { createApiError } from "./create-api-error";

export async function performApiRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(buildApiUrl(path), {
      method: options.method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "X-School-Code": SCHOOL_CODE,
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(options.accessToken
          ? { Authorization: `Bearer ${options.accessToken}` }
          : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
    if (response.status === 204) return undefined as T;

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      throw new ApiClientError({
        code: "INVALID_API_RESPONSE",
        message: "Something went wrong. Please try again.",
      });
    }
    if (!response.ok) {
      throw createApiError(payload as ApiErrorEnvelope, response.status);
    }
    return payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: T }).data
      : payload as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (controller.signal.aborted) {
      throw new ApiClientError({
        code: "REQUEST_TIMEOUT",
        message: "This is taking too long. Check your connection and try again.",
        retryable: true,
      });
    }
    throw new ApiClientError({
      code: "NETWORK_UNAVAILABLE",
      message: "Check your internet connection and try again.",
      retryable: true,
    });
  } finally {
    clearTimeout(timeout);
  }
}
