/**
 * API Services barrel export
 */

export { httpClient, HttpClient } from "./http-client";
export { authApi, mapApiRoleToAppRole } from "./auth.api";
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiUser,
  AppRoleMapping 
} from "./auth.api";
