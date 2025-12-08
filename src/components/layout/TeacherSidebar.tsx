import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  FileQuestion,
  LogOut,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/maestro", icon: LayoutDashboard },
  { title: "Mis Asignaturas", url: "/maestro/asignaturas", icon: BookOpen },
  { title: "Gestión de Contenido", url: "/maestro/contenido", icon: FolderOpen },
  { title: "Exámenes", url: "/maestro/examenes", icon: FileQuestion },
];

interface TeacherSidebarProps {
  onNavigate?: () => void;
}

export function TeacherSidebar({ onNavigate }: TeacherSidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "MT";

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">EduManager</h1>
            <p className="text-xs text-sidebar-foreground/60">Panel Maestro</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/maestro"}
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
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email || "Maestro"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">Maestro</p>
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
