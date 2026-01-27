import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks";
import { LogOut } from "lucide-react";
import { TEACHER_NAV_ITEMS, APP_CONFIG, ROLE_LABELS } from "@/config";
import edubbaLogo from "@/assets/edubba-logo.png";

interface TeacherSidebarProps {
  onNavigate?: () => void;
}

export function TeacherSidebar({ onNavigate }: TeacherSidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "MA";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className="md:fixed left-0 top-0 z-40 h-full md:h-screen w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 md:py-6 border-b border-sidebar-border flex-shrink-0">
        <img src={edubbaLogo} alt={APP_CONFIG.name} className="h-8 md:h-10 w-auto object-contain" />
        <div>
          <p className="text-xs text-sidebar-foreground/60">Panel {ROLE_LABELS.maestro}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 md:py-6 space-y-1 overflow-y-auto min-h-0">
        {TEACHER_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/maestro"}
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
      <div className="border-t border-sidebar-border p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 md:mb-4 px-2 md:px-3">
          <div className="h-8 md:h-9 w-8 md:w-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs md:text-sm font-medium text-primary-foreground">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-sidebar-foreground truncate">
              {user?.email || "Maestro"}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{ROLE_LABELS.maestro}</p>
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
    </aside>
  );
}
