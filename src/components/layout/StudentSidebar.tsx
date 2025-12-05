import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Trophy,
  LogOut,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { title: "Inicio", url: "/alumno", icon: LayoutDashboard },
  { title: "Mis Cursos", url: "/alumno/cursos", icon: BookOpen },
  { title: "Exámenes", url: "/alumno/examenes", icon: FileQuestion },
  { title: "Calificaciones", url: "/alumno/calificaciones", icon: Trophy },
];

export function StudentSidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get initials from email
  const initials = user?.email?.slice(0, 2).toUpperCase() || "AL";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">EduManager</h1>
            <p className="text-xs text-sidebar-foreground/60">Portal Alumno</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/alumno"}
              className="sidebar-link"
              activeClassName="sidebar-link-active"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="h-9 w-9 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email || "Alumno"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">Alumno</p>
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
