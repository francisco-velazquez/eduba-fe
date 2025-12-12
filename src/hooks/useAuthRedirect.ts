import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getDashboardByRole, isPublicRoute } from "@/config/routes.config";

interface UseAuthRedirectOptions {
  redirectAuthenticated?: boolean;  // Redirect to dashboard if authenticated (for login page)
  requiredRole?: string;            // Required role to access the page
}

/**
 * Hook to handle authentication-based redirects
 */
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { redirectAuthenticated = false, requiredRole } = options;

  useEffect(() => {
    if (isLoading) return;

    // If on a public route and authenticated, redirect to dashboard
    if (redirectAuthenticated && user && role) {
      const dashboardPath = getDashboardByRole(role);
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If on a protected route without auth, redirect to login
    if (!isPublicRoute(location.pathname) && !user) {
      navigate("/", { replace: true });
      return;
    }

    // If role is required and doesn't match, redirect to correct dashboard
    if (requiredRole && role && role !== requiredRole) {
      const dashboardPath = getDashboardByRole(role);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, role, isLoading, redirectAuthenticated, requiredRole, navigate, location.pathname]);

  return { isLoading, isAuthenticated: !!user, role };
}
