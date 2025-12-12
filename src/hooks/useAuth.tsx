import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth.service";
import type { AppRole, AuthUser, SignInCredentials, SignUpCredentials, AuthResult } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  role: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!session;

  const fetchUserRole = useCallback(async (userId: string) => {
    const userRole = await authService.getUserRole(userId);
    setRole(userRole);
  }, []);

  const mapSessionToUser = useCallback((session: Session | null): AuthUser | null => {
    if (!session?.user) return null;
    
    return {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.user_metadata?.full_name,
    };
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setSession(session);
      setUser(mapSessionToUser(session));
      
      // Defer role fetch with setTimeout to avoid deadlock
      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setRole(null);
      }
      
      setIsLoading(false);
    });

    // THEN check for existing session
    authService.getSession().then(({ session }) => {
      setSession(session);
      setUser(mapSessionToUser(session));
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole, mapSessionToUser]);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<AuthResult> => {
    return authService.signIn(credentials);
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<AuthResult> => {
    return authService.signUp(credentials);
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const result = await authService.signOut();
    if (result.success) {
      setRole(null);
    }
    return result;
  }, []);

  const value: AuthContextType = {
    user,
    session,
    role,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
