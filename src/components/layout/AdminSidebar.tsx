import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  School,
  UserCog,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Maestros", url: "/maestros", icon: UserCog },
  { title: "Alumnos", url: "/alumnos", icon: Users },
  { title: "Grados", url: "/grados", icon: GraduationCap },
  { title: "Asignaturas", url: "/asignaturas", icon: BookOpen },
  { title: "Asignaciones", url: "/asignaciones", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <School className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">EduManager</h1>
            <p className="text-xs text-sidebar-foreground/60">Panel Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="sidebar-link"
              activeClassName="sidebar-link-active"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button className="sidebar-link w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
