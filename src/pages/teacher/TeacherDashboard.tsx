import { BookOpen, Users, FileQuestion, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/common";

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
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Bienvenido, Profesor García"
        description="Aquí tienes un resumen de tu actividad docente"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* My Subjects */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
            Mis Asignaturas
          </h3>
          <div className="space-y-3">
            {mySubjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-base truncate">
                      {subject.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      {subject.grade}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="text-xs md:text-sm font-medium text-foreground">
                    {subject.students} alumnos
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {subject.modules} módulos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exams */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
            Exámenes Recientes
          </h3>
          <div className="space-y-3">
            {recentExams.map((exam, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm truncate">{exam.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{exam.subject}</p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  {exam.pending > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-600">
                      {exam.pending} por revisar
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600">
                      Completado
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{exam.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Crear Módulo", description: "Agregar nuevo contenido", href: "/maestro/contenido" },
          { title: "Subir Material", description: "Videos, PDFs, presentaciones", href: "/maestro/contenido" },
          { title: "Crear Examen", description: "Nueva evaluación", href: "/maestro/examenes" },
          { title: "Ver Calificaciones", description: "Resultados de alumnos", href: "/maestro/examenes" },
        ].map((action, index) => (
          <a
            key={action.title}
            href={action.href}
            className="group stat-card cursor-pointer hover:border-emerald-500/50 animate-fade-in p-4 md:p-6"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h4 className="font-medium text-foreground group-hover:text-emerald-600 transition-colors text-sm md:text-base">
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
