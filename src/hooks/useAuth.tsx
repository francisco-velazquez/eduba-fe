import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { authService } from "@/services/auth.service";
import type { AppRole, AuthUser, SignInCredentials, SignUpCredentials, AuthResult } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
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
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user, role } = await authService.getSession();
        setUser(user);
        setRole(role);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((event, user, role) => {
      setUser(user);
      setRole(role);
      
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
      }
    });

    // Initialize
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<AuthResult> => {
    return authService.signIn(credentials);
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<AuthResult> => {
    return authService.signUp(credentials);
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    const result = await authService.signOut();
    return result;
  }, []);

  const value: AuthContextType = {
    user,
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
