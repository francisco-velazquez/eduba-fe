import { LucideIcon, LayoutDashboard, Users, GraduationCap, BookOpen, Settings, UserCog, FileText, Play, Award } from "lucide-react";

// Route configuration
export interface RouteConfig {
  path: string;
  title: string;
  icon: LucideIcon;
  description?: string;
}

// Base paths for each role
export const ROLE_BASE_PATHS = {
  admin: "/admin",
  maestro: "/maestro",
  alumno: "/alumno",
} as const;

// Admin Navigation
export const ADMIN_NAV_ITEMS: RouteConfig[] = [
  { path: "/admin", title: "Dashboard", icon: LayoutDashboard, description: "Vista general" },
  { path: "/admin/maestros", title: "Maestros", icon: UserCog, description: "Gestión de docentes" },
  { path: "/admin/alumnos", title: "Alumnos", icon: Users, description: "Gestión de estudiantes" },
  { path: "/admin/grados", title: "Grados", icon: GraduationCap, description: "Niveles académicos" },
  { path: "/admin/asignaturas", title: "Asignaturas", icon: BookOpen, description: "Materias" },
  { path: "/admin/asignaciones", title: "Asignaciones", icon: Settings, description: "Configuración" },
];

// Teacher Navigation
export const TEACHER_NAV_ITEMS: RouteConfig[] = [
  { path: "/maestro", title: "Dashboard", icon: LayoutDashboard, description: "Vista general" },
  { path: "/maestro/asignaturas", title: "Mis Asignaturas", icon: BookOpen, description: "Materias asignadas" },
  { path: "/maestro/contenido", title: "Contenido", icon: Play, description: "Recursos y material" },
  { path: "/maestro/examenes", title: "Exámenes", icon: FileText, description: "Evaluaciones" },
];

// Student Navigation
export const STUDENT_NAV_ITEMS: RouteConfig[] = [
  { path: "/alumno", title: "Dashboard", icon: LayoutDashboard, description: "Vista general" },
  { path: "/alumno/cursos", title: "Mis Cursos", icon: BookOpen, description: "Materias inscritas" },
  { path: "/alumno/examenes", title: "Exámenes", icon: FileText, description: "Evaluaciones" },
  { path: "/alumno/calificaciones", title: "Calificaciones", icon: Award, description: "Mis notas" },
];

// Public routes that don't require authentication
export const PUBLIC_ROUTES = ["/", "/login"];

// Helper to check if a route is public
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path);
}

// Helper to get dashboard path by role
export function getDashboardByRole(role: string): string {
  return ROLE_BASE_PATHS[role as keyof typeof ROLE_BASE_PATHS] || "/";
}
