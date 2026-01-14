/**
 * Authentication Service
 * Handles all authentication-related operations using external API
 */

import { authApi, mapApiRoleToAppRole, type ApiUser } from "./api";
import type { AppRole, AuthResult, SignInCredentials, SignUpCredentials, AuthUser } from "@/types";

// Event types for auth state changes
type AuthEventType = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED";

interface AuthStateChangeCallback {
  (event: AuthEventType, user: AuthUser | null, role: AppRole | null): void;
}

// Store subscribers for auth state changes
const authStateSubscribers: Set<AuthStateChangeCallback> = new Set();

/**
 * Map API user to app user
 */
const mapApiUserToAuthUser = (apiUser: ApiUser): AuthUser => ({
  id: apiUser.id,
  email: apiUser.email,
  fullName: apiUser.name,
  role: mapApiRoleToAppRole(apiUser.role),
});

/**
 * Notify all subscribers of auth state change
 */
const notifyAuthStateChange = (
  event: AuthEventType,
  user: AuthUser | null,
  role: AppRole | null
): void => {
  authStateSubscribers.forEach((callback) => {
    try {
      callback(event, user, role);
    } catch (error) {
      console.error("Error in auth state callback:", error);
    }
  });
};

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInCredentials): Promise<AuthResult> {
    try {
      const response = await authApi.login({ email, password });

      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const user = mapApiUserToAuthUser(response.data.user);
        const role = mapApiRoleToAppRole(response.data.user.role);
        
        // Notify subscribers
        notifyAuthStateChange("SIGNED_IN", user, role);
        
        return { success: true };
      }

      return { success: false, error: "Error inesperado al iniciar sesión" };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "Error inesperado al iniciar sesión" };
    }
  },

  /**
   * Sign up with email, password and full name
   */
  async signUp({ email, password, fullName }: SignUpCredentials): Promise<AuthResult> {
    try {
      const response = await authApi.register({
        email,
        password,
        name: fullName,
      });

      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const user = mapApiUserToAuthUser(response.data.user);
        const role = mapApiRoleToAppRole(response.data.user.role);
        
        // Notify subscribers
        notifyAuthStateChange("SIGNED_IN", user, role);
        
        return { success: true };
      }

      return { success: false, error: "Error inesperado al registrarse" };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: "Error inesperado al registrarse" };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      authApi.logout();
      
      // Notify subscribers
      notifyAuthStateChange("SIGNED_OUT", null, null);
      
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error: "Error al cerrar sesión" };
    }
  },

  /**
   * Get current session/user
   */
  getSession(): { user: AuthUser | null; role: AppRole | null; error: string | null } {
    try {
      // Check if we have a token
      if (!authApi.isAuthenticated()) {
        return { user: null, role: null, error: null };
      }

      // Fetch current user profile
      const response: ApiUser | null= authApi.getCurrentUser();

      if (!response) {
        authApi.logout();
        return { user: null, role: null, error: 'Sesión expirada. Por favor, inicia sesión nuevamente.' };
      }

      if (response) {
        const user = mapApiUserToAuthUser(response);
        const role = mapApiRoleToAppRole(response.role);
        return { user, role, error: null };
      }

      return { user: null, role: null, error: null };
    } catch (error) {
      return { user: null, role: null, error: "Error al obtener sesión" };
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return authApi.isAuthenticated();
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback): { unsubscribe: () => void } {
    authStateSubscribers.add(callback);

    return {
      unsubscribe: () => {
        authStateSubscribers.delete(callback);
      },
    };
  },
};
