export class ApiClientError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly requestId?: string;
  readonly retryable: boolean;

  constructor(input: {
    message: string;
    code: string;
    status?: number;
    requestId?: string;
    retryable?: boolean;
  }) {
    super(input.message);
    this.name = "ApiClientError";
    this.code = input.code;
    this.status = input.status;
    this.requestId = input.requestId;
    this.retryable = input.retryable ?? false;
  }
}
