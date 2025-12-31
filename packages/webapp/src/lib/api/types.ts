export interface ApiRequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
