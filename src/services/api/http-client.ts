/**
 * HTTP Client for external API
 * Base configuration for all API requests
 */

const API_BASE_URL = "https://edubba-bep-prb.onrender.com";

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

class HttpClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
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
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Build headers for request
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...customHeaders,
    });

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
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
   * Make HTTP request
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, headers: customHeaders, ...restConfig } = config;

    try {
      console.log(endpoint, params)
      const headers = this.buildHeaders(customHeaders);
      console.log(headers)
      const response = await fetch(this.buildUrl(endpoint, params), {
        ...restConfig,
        headers: headers,
      });
      console.log(response)

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

      return { data, error, status };
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
