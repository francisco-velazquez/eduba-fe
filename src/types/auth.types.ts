// Auth Types
export type AppRole = "admin" | "maestro" | "alumno";

export interface AuthUser {
  id: string;
  email: string | undefined;
  fullName?: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  role: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  fullName: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
