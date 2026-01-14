import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks";
import { LogOut } from "lucide-react";
import { ADMIN_NAV_ITEMS, APP_CONFIG, ROLE_LABELS } from "@/config";
import edubbaLogo from "@/assets/edubba-logo.png";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className="md:fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <img src={edubbaLogo} alt={APP_CONFIG.name} className="h-10 w-auto object-contain" />
          <div>
            <p className="text-xs text-sidebar-foreground/60">Panel {ROLE_LABELS.admin}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className="sidebar-link"
              activeClassName="sidebar-link-active"
              onClick={handleNavClick}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email || "Administrador"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">{ROLE_LABELS.admin}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="sidebar-link w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
