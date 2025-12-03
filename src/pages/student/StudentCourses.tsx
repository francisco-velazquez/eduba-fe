import { BookOpen, Play, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    id: 1,
    name: "Matemáticas",
    teacher: "Prof. Juan García",
    progress: 65,
    modules: 5,
    completedModules: 3,
    nextLesson: "Ecuaciones cuadráticas",
    lastAccessed: "Hace 2 horas",
    color: "violet",
  },
  {
    id: 2,
    name: "Español",
    teacher: "Prof. Ana Martínez",
    progress: 80,
    modules: 4,
    completedModules: 3,
    nextLesson: "Análisis literario - Don Quijote",
    lastAccessed: "Ayer",
    color: "blue",
  },
  {
    id: 3,
    name: "Ciencias Naturales",
    teacher: "Prof. Carlos López",
    progress: 45,
    modules: 6,
    completedModules: 2,
    nextLesson: "El sistema solar",
    lastAccessed: "Hace 3 días",
    color: "emerald",
  },
  {
    id: 4,
    name: "Historia",
    teacher: "Prof. María Rodríguez",
    progress: 30,
    modules: 5,
    completedModules: 1,
    nextLesson: "La Revolución Mexicana",
    lastAccessed: "Hace 1 semana",
    color: "amber",
  },
  {
    id: 5,
    name: "Inglés",
    teacher: "Prof. Robert Smith",
    progress: 55,
    modules: 4,
    completedModules: 2,
    nextLesson: "Past tense verbs",
    lastAccessed: "Hace 2 días",
    color: "rose",
  },
  {
    id: 6,
    name: "Geografía",
    teacher: "Prof. Laura Sánchez",
    progress: 20,
    modules: 4,
    completedModules: 1,
    nextLesson: "Continentes y océanos",
    lastAccessed: "Hace 5 días",
    color: "cyan",
  },
];

export default function StudentCourses() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-header">Mis Cursos</h1>
        <p className="page-description">
          3° Secundaria - Segundo Trimestre
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Color Header */}
            <div className={`h-2 bg-${course.color}-500`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-violet-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{course.teacher}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-${course.color}-500/20 flex items-center justify-center`}>
                  <BookOpen className={`h-5 w-5 text-${course.color}-600`} />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium text-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {course.completedModules} de {course.modules} módulos completados
                </p>
              </div>

              {/* Next Lesson */}
              <div className="p-3 bg-muted/30 rounded-lg mb-4">
                <p className="text-xs text-muted-foreground mb-1">Siguiente lección:</p>
                <p className="text-sm font-medium text-foreground">{course.nextLesson}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.lastAccessed}
                </span>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                  <Play className="h-4 w-4 mr-1" />
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
