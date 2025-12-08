import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarContentProps {
  navItems: NavItem[];
  logoIcon: LucideIcon;
  logoColor: string;
  title: string;
  subtitle: string;
  baseUrl: string;
  onNavigate?: () => void;
}

export function SidebarContent({
  navItems,
  logoIcon: LogoIcon,
  logoColor,
  title,
  subtitle,
  baseUrl,
  onNavigate,
}: SidebarContentProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "US";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${logoColor}`}>
          <LogoIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">{title}</h1>
          <p className="text-xs text-sidebar-foreground/60">{subtitle}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === baseUrl}
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
          <div className={`h-9 w-9 rounded-full ${logoColor} flex items-center justify-center`}>
            <span className="text-sm font-medium text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.email || "Usuario"}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{subtitle.replace("Panel ", "").replace("Portal ", "")}</p>
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
  );
}
