import { supabase } from "@/integrations/supabase/client";
import type { AppRole, AuthResult, SignInCredentials, SignUpCredentials } from "@/types";

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInCredentials): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error inesperado al iniciar sesión" };
    }
  },

  /**
   * Sign up with email, password and full name
   */
  async signUp({ email, password, fullName }: SignUpCredentials): Promise<AuthResult> {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName },
        },
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error inesperado al registrarse" };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error al cerrar sesión" };
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  /**
   * Get user role from database
   */
  async getUserRole(userId: string): Promise<AppRole | null> {
    try {
      const { data, error } = await supabase.rpc("get_user_role", { _user_id: userId });
      
      if (error || !data) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return data as AppRole;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
