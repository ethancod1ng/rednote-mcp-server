import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, RequestConfig } from '../types/api.js';
import logger from '../utils/logger.js';
import { SimpleCache } from '../utils/cache.js';

export class ApiClient {
  private client: AxiosInstance;
  private cache: SimpleCache<any>;
  private defaultConfig: RequestConfig;

  constructor(baseURL: string = '', config: RequestConfig = {}) {
    this.defaultConfig = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config
    };

    this.client = axios.create({
      baseURL,
      timeout: this.defaultConfig.timeout,
      headers: {
        'User-Agent': 'RedNote-MCP-Server/1.0.0',
        'Accept': 'application/json',
        ...this.defaultConfig.headers
      }
    });

    this.cache = new SimpleCache(1000);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data
        });
        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`, {
          data: response.data
        });
        return response;
      },
      (error) => {
        logger.error('API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      logger.debug(`Cache hit for: ${cacheKey}`);
      return cached;
    }

    try {
      const response = await this.withRetry(() => this.client.get<T>(url, config));
      const result: ApiResponse<T> = {
        success: true,
        data: response.data
      };
      
      this.cache.set(cacheKey, result, 300000);
      return result;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.withRetry(() => this.client.post<T>(url, data, config));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private async withRetry<T>(operation: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= (this.defaultConfig.retries || 1); attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === this.defaultConfig.retries || !this.shouldRetry(error)) {
          throw error;
        }
        
        const delay = (this.defaultConfig.retryDelay || 1000) * attempt;
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, {
          error: error.message
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  private shouldRetry(error: any): boolean {
    if (!error.response) return true;
    
    const status = error.response.status;
    return status >= 500 || status === 429;
  }

  private handleError<T>(error: any): ApiResponse<T> {
    const apiError: ApiError = {
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Unknown error',
      details: error.response?.data
    };

    logger.error('API Error:', apiError);

    return {
      success: false,
      error: apiError.message,
      code: apiError.code
    };
  }
}