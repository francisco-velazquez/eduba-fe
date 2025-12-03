import { BookOpen, FileQuestion, Trophy, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-header">¡Hola, María!</h1>
        <p className="page-description">
          Continúa aprendiendo, vas muy bien en tu progreso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Mis Cursos</h3>
          <div className="space-y-4">
            {myCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">{course.name}</h4>
                    <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{course.teacher}</p>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Siguiente: {course.nextLesson}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Próximos Exámenes</h3>
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
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Calificaciones Recientes</h3>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{grade.name}</p>
                    <p className="text-xs text-muted-foreground">{grade.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${grade.grade >= 9 ? 'text-emerald-600' : grade.grade >= 7 ? 'text-amber-600' : 'text-red-600'}`}>
                      {grade.grade}
                    </p>
                    <p className="text-xs text-muted-foreground">{grade.date}</p>
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
