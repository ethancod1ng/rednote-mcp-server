export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
  message?: string;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
}