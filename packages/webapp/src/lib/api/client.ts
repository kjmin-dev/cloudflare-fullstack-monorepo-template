import { getApiConfig } from './config';
import { ApiError, type ApiRequestConfig, type ApiResponse, type HttpMethod } from './types';

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const { baseUrl } = getApiConfig();
  const url = new URL(path, baseUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function request<T>(method: HttpMethod, path: string, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
  const { params, body, timeout, headers: customHeaders, ...restConfig } = config;
  const { timeout: defaultTimeout } = getApiConfig();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout ?? defaultTimeout);

  const headers = new Headers(customHeaders);

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...restConfig,
    });

    if (!response.ok) {
      // RFC 7807 Problem Details format
      const errorBody = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      const message =
        typeof errorBody.detail === 'string'
          ? errorBody.detail
          : typeof errorBody.title === 'string'
            ? errorBody.title
            : `Request failed with status ${response.status}`;
      const { status: _, title: __, detail: ___, code, ...extensions } = errorBody;
      throw new ApiError(
        message,
        response.status,
        typeof code === 'string' ? code : undefined,
        Object.keys(extensions).length > 0 ? extensions : undefined,
      );
    }

    const contentType = response.headers.get('Content-Type');
    const data = contentType?.includes('application/json') ? await response.json() : await response.text();

    return {
      data: data as T,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get<T>(path: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>('GET', path, config);
  },

  post<T>(path: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>('POST', path, { ...config, body });
  },

  put<T>(path: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>('PUT', path, { ...config, body });
  },

  patch<T>(path: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>('PATCH', path, { ...config, body });
  },

  delete<T>(path: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return request<T>('DELETE', path, config);
  },
};
