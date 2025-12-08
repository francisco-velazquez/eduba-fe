import { Users, GraduationCap, BookOpen, FileText } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Bienvenido al panel de administración de EduManager
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Alumnos"
          value={1248}
          description="En todos los grados"
          icon={Users}
          trend={{ value: 12, positive: true }}
          variant="primary"
        />
        <StatCard
          title="Maestros Activos"
          value={45}
          description="Impartiendo clases"
          icon={GraduationCap}
          trend={{ value: 3, positive: true }}
          variant="accent"
        />
        <StatCard
          title="Asignaturas"
          value={32}
          description="Distribuidas en 6 grados"
          icon={BookOpen}
          variant="warning"
        />
        <StatCard
          title="Exámenes Aplicados"
          value={156}
          description="Este mes"
          icon={FileText}
          trend={{ value: 8, positive: true }}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">
            Actividad de Exámenes por Grado
          </h3>
          <div className="h-48 md:h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Gráfico de actividad</p>
              <p className="text-xs">Conecta una base de datos para ver estadísticas reales</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Agregar Alumno", description: "Registrar nuevo estudiante", href: "/admin/alumnos" },
          { title: "Agregar Maestro", description: "Registrar nuevo docente", href: "/admin/maestros" },
          { title: "Crear Grado", description: "Nuevo grado académico", href: "/admin/grados" },
          { title: "Nueva Asignatura", description: "Crear materia", href: "/admin/asignaturas" },
        ].map((action, index) => (
          <a
            key={action.title}
            href={action.href}
            className="group stat-card cursor-pointer hover:border-primary/50 animate-fade-in p-4 md:p-6"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
              {action.title}
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden sm:block">
              {action.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
