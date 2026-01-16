import { BookOpen, Play, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { getCourseColor } from "@/services/api/student-subjects.api";
import { useNavigate } from "react-router-dom";

export default function StudentCourses() {
  const { courses, currentGrade, isLoading, isError, error } = useStudentCourses();
  const navigate = useNavigate();

  // Format grade info for header
  const gradeInfo = currentGrade
    ? `${currentGrade.name} - ${currentGrade.code}`
    : "Sin grado asignado";

  const handleContinueCourse = (courseId: number) => {
    navigate(`/alumno/cursos/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Mis Cursos"
          description={gradeInfo}
        />
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error al cargar los cursos
          </h3>
          <p className="text-muted-foreground max-w-md">
            {error?.message || "Ocurrió un error al obtener tus cursos. Por favor, intenta de nuevo."}
          </p>
        </div>
      </div>
    );
  }

  // Filter only active courses
  const activeCourses = courses.filter((course) => course.isActive);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Mis Cursos"
        description={gradeInfo}
      />

      {activeCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No tienes cursos asignados"
          description="Aún no se te han asignado cursos. Contacta a tu administrador para más información."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCourses.map((course, index) => {
            const color = getCourseColor(index);
            const colorClasses = getColorClasses(color);

            return (
              <div
                key={course.id}
                className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Color Header */}
                <div className={`h-2 ${colorClasses.bg}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                        {course.name}
                      </h3>
                      {course.code && (
                        <p className="text-sm text-muted-foreground">
                          Código: {course.code}
                        </p>
                      )}
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${colorClasses.bgLight} flex items-center justify-center flex-shrink-0 ml-3`}>
                      <BookOpen className={`h-5 w-5 ${colorClasses.text}`} />
                    </div>
                  </div>

                  {/* Description */}
                  {course.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.completedModules} de {course.totalModules} módulos completados
                    </p>
                  </div>

                  {/* Modules Info */}
                  {course.totalModules > 0 ? (
                    <div className="p-3 bg-muted/30 rounded-lg mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Módulos disponibles:</p>
                      <p className="text-sm font-medium text-foreground">
                        {course.modules.slice(0, 2).map((m) => m.title).join(", ")}
                        {course.modules.length > 2 && ` y ${course.modules.length - 2} más`}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted/30 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        Sin módulos disponibles aún
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.lastAccessed || "Sin acceder"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleContinueCourse(course.id)}
                      disabled={course.totalModules === 0}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {course.totalModules > 0 ? "Continuar" : "Próximamente"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function to get Tailwind color classes based on color name
function getColorClasses(color: string): { bg: string; bgLight: string; text: string } {
  const colorMap: Record<string, { bg: string; bgLight: string; text: string }> = {
    violet: {
      bg: "bg-violet-500",
      bgLight: "bg-violet-500/20",
      text: "text-violet-600",
    },
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-500/20",
      text: "text-blue-600",
    },
    emerald: {
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-500/20",
      text: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-500",
      bgLight: "bg-amber-500/20",
      text: "text-amber-600",
    },
    rose: {
      bg: "bg-rose-500",
      bgLight: "bg-rose-500/20",
      text: "text-rose-600",
    },
    cyan: {
      bg: "bg-cyan-500",
      bgLight: "bg-cyan-500/20",
      text: "text-cyan-600",
    },
    indigo: {
      bg: "bg-indigo-500",
      bgLight: "bg-indigo-500/20",
      text: "text-indigo-600",
    },
    teal: {
      bg: "bg-teal-500",
      bgLight: "bg-teal-500/20",
      text: "text-teal-600",
    },
    orange: {
      bg: "bg-orange-500",
      bgLight: "bg-orange-500/20",
      text: "text-orange-600",
    },
    pink: {
      bg: "bg-pink-500",
      bgLight: "bg-pink-500/20",
      text: "text-pink-600",
    },
  };

  return colorMap[color] || colorMap.violet;
}
