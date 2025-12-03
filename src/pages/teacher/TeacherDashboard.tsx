import { BookOpen, Users, FileQuestion, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

const mySubjects = [
  { name: "Matemáticas", grade: "3° Secundaria", students: 32, modules: 5 },
  { name: "Álgebra", grade: "2° Secundaria", students: 28, modules: 4 },
  { name: "Geometría", grade: "1° Secundaria", students: 35, modules: 3 },
];

const recentExams = [
  { name: "Examen Parcial - Ecuaciones", subject: "Matemáticas", pending: 12, date: "Hace 2 días" },
  { name: "Quiz - Factorización", subject: "Álgebra", pending: 0, date: "Hace 5 días" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-header">Bienvenido, Profesor García</h1>
        <p className="page-description">
          Aquí tienes un resumen de tu actividad docente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Asignaturas"
          value={3}
          description="Asignadas este periodo"
          icon={BookOpen}
          variant="accent"
        />
        <StatCard
          title="Alumnos Totales"
          value={95}
          description="En todas tus clases"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Exámenes Creados"
          value={12}
          description="Este mes"
          icon={FileQuestion}
          variant="warning"
        />
        <StatCard
          title="Promedio General"
          value="8.5"
          description="De tus estudiantes"
          icon={TrendingUp}
          trend={{ value: 5, positive: true }}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Subjects */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Mis Asignaturas</h3>
          <div className="space-y-3">
            {mySubjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{subject.students} alumnos</p>
                  <p className="text-xs text-muted-foreground">{subject.modules} módulos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exams */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Exámenes Recientes</h3>
          <div className="space-y-3">
            {recentExams.map((exam, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{exam.name}</p>
                  <p className="text-sm text-muted-foreground">{exam.subject}</p>
                </div>
                <div className="text-right">
                  {exam.pending > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-600">
                      {exam.pending} por revisar
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600">
                      Completado
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{exam.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Crear Módulo", description: "Agregar nuevo contenido", href: "/maestro/contenido" },
          { title: "Subir Material", description: "Videos, PDFs, presentaciones", href: "/maestro/contenido" },
          { title: "Crear Examen", description: "Nueva evaluación", href: "/maestro/examenes" },
          { title: "Ver Calificaciones", description: "Resultados de alumnos", href: "/maestro/examenes" },
        ].map((action, index) => (
          <a
            key={action.title}
            href={action.href}
            className="group stat-card cursor-pointer hover:border-emerald-500/50 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h4 className="font-medium text-foreground group-hover:text-emerald-600 transition-colors">
              {action.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
