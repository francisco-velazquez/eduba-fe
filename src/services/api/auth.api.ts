/**
 * Authentication API Service
 * Handles all auth-related API calls to external backend
 */

import { httpClient } from "./http-client";

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
  updatedAt: string;
}

// Map API roles to app roles
export type AppRoleMapping = {
  ADMIN: "admin";
  TEACHER: "maestro";
  STUDENT: "alumno";
};

const roleMapping: AppRoleMapping = {
  ADMIN: "admin",
  TEACHER: "maestro",
  STUDENT: "alumno",
};

export const mapApiRoleToAppRole = (apiRole: ApiUser["role"]): "admin" | "maestro" | "alumno" => {
  return roleMapping[apiRole] || "alumno";
};

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest) {
    const response = await httpClient.post<AuthResponse>("/auth/login", credentials);
    
    if (response.data?.access_token) {
      httpClient.setToken(response.data.access_token);
    }
    
    return response;
  },

  /**
   * Register new user
   */
  async register(userData: RegisterRequest) {
    const response = await httpClient.post<AuthResponse>("/auth/register", userData);
    
    if (response.data?.access_token) {
      httpClient.setToken(response.data.access_token);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout(): void {
    httpClient.setToken(null);
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return httpClient.get<ApiUser>("/auth/profile");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return httpClient.isAuthenticated();
  },

  /**
   * Get current token
   */
  getToken(): string | null {
    return httpClient.getToken();
  },
};
