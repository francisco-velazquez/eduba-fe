import { BookOpen, FileQuestion, Trophy, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common";

const myCourses = [
  { name: "Matemáticas", teacher: "Prof. García", progress: 65, nextLesson: "Ecuaciones cuadráticas" },
  { name: "Español", teacher: "Prof. Martínez", progress: 80, nextLesson: "Análisis literario" },
  { name: "Ciencias", teacher: "Prof. López", progress: 45, nextLesson: "Sistema solar" },
  { name: "Historia", teacher: "Prof. Rodríguez", progress: 30, nextLesson: "Revolución Mexicana" },
];

const upcomingExams = [
  { name: "Quiz - Ecuaciones", subject: "Matemáticas", date: "Mañana", time: "10:00 AM" },
  { name: "Examen Parcial", subject: "Español", date: "Vie 25 Ene", time: "2:00 PM" },
];

const recentGrades = [
  { name: "Tarea - Factorización", subject: "Matemáticas", grade: 9.5, date: "Hace 2 días" },
  { name: "Quiz - Verbos", subject: "Español", grade: 8.0, date: "Hace 4 días" },
  { name: "Proyecto - Ecosistemas", subject: "Ciencias", grade: 10, date: "Hace 1 semana" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="¡Hola, María!"
        description="Continúa aprendiendo, vas muy bien en tu progreso"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cursos Activos"
          value={6}
          description="En tu grado actual"
          icon={BookOpen}
          variant="accent"
        />
        <StatCard
          title="Exámenes Pendientes"
          value={2}
          description="Esta semana"
          icon={FileQuestion}
          variant="warning"
        />
        <StatCard
          title="Promedio General"
          value="9.2"
          description="Este trimestre"
          icon={Trophy}
          trend={{ value: 3, positive: true }}
          variant="primary"
        />
        <StatCard
          title="Horas de Estudio"
          value={24}
          description="Esta semana"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">Mis Cursos</h3>
          <div className="space-y-3 md:space-y-4">
            {myCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm md:text-base truncate">
                      {course.name}
                    </h4>
                    <span className="text-xs md:text-sm font-medium text-foreground ml-2">
                      {course.progress}%
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 truncate">
                    {course.teacher}
                  </p>
                  <Progress value={course.progress} className="h-1.5 md:h-2" />
                  <p className="text-xs text-muted-foreground mt-2 truncate hidden sm:block">
                    Siguiente: {course.nextLesson}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Upcoming Exams */}
          <div className="bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
              Próximos Exámenes
            </h3>
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <div
                  key={index}
                  className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                >
                  <p className="font-medium text-foreground text-sm">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.subject}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-amber-600 font-medium">{exam.date}</span>
                    <span className="text-muted-foreground">• {exam.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-card rounded-xl border border-border shadow-card p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">
              Calificaciones Recientes
            </h3>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{grade.name}</p>
                    <p className="text-xs text-muted-foreground">{grade.subject}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p
                      className={`text-base md:text-lg font-bold ${
                        grade.grade >= 9
                          ? "text-emerald-600"
                          : grade.grade >= 7
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {grade.grade}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{grade.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
