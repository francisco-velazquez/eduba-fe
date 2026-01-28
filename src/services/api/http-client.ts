/**
 * HTTP Client for external API
 * Base configuration for all API requests
 */

const API_BASE_URL = "http://localhost:3000";

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ApiError {
  message?: string;
  response?: {
    status?: number;
  };
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: ApiResponse<unknown>) => void;

class HttpClient {
  private baseUrl: string;
  private token: string | null = null;
  private user: string | null = null;
  private interceptors: ResponseInterceptor[] = [];
  private requestInterceptors: RequestInterceptor[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
    this.loadUser();

    // Inyectar token automáticamente mediante un interceptor
    this.addRequestInterceptor((config) => {
      if (this.token) {
        const headers = new Headers(config.headers);
        headers.set("Authorization", `Bearer ${this.token}`);
        config.headers = headers;
      }
      return config;
    });
  }

  /**
   * Load token from localStorage
   */
  private loadToken(): void {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  /**
   * Load user from localStorage
   */
  private loadUser(): void {
    if (typeof window !== "undefined") {
      this.user = localStorage.getItem("auth_user");
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  /**
   * Set user
   */
  setUser(user: string | null): void {
    this.user = user;
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("auth_user", user);
      } else {
        localStorage.removeItem("auth_user");
      }
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Get current user
   */
  getUser(): string | null {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  /**
   * Build headers for request
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  }

  /**
   * Build URL with query params
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Add a response interceptor
   */
  addInterceptor(interceptor: ResponseInterceptor): void {
    this.interceptors.push(interceptor);
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    let finalConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    const { params, headers: customHeaders, ...restConfig } = finalConfig;

    try {
      const headers = this.buildHeaders(customHeaders);
      const response = await fetch(this.buildUrl(endpoint, params), {
        ...restConfig,
        headers: headers,
      });

      const status = response.status;

      // Handle no content responses
      if (status === 204) {
        return { data: null, error: null, status };
      }

      // Try to parse JSON
      let data: T | null = null;
      let error: string | null = null;

      try {
        const json = await response.json();
        
        if (response.ok) {
          data = json;
        } else {
          error = json.message || json.error || "Error en la solicitud";
        }
      } catch {
        if (!response.ok) {
          error = `Error ${status}: ${response.statusText}`;
        }
      }

      // Handle unauthorized - clear token
      if (status === 401) {
        this.setToken(null);
        error = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      }

      const apiResponse: ApiResponse<T> = { data, error, status };
      
      this.interceptors.forEach((interceptor) => interceptor(apiResponse));

      return apiResponse;
    } catch (err) {
      console.error("HTTP Request Error:", err);
      return {
        data: null,
        error: "Error de conexión. Verifica tu conexión a internet.",
        status: 0,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const httpClient = new HttpClient(API_BASE_URL);

// Export class for testing
export { HttpClient };
