export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiRequestOptions = {
  method: HttpMethod;
  body?: unknown;
  accessToken?: string;
  cacheScope?: string;
};

export type ApiEnvelope<T> = {
  data: T;
};

export type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
    retryable?: boolean;
  };
};

export type GetCacheEntry<T> = {
  expiresAt: number;
  value: T;
};
