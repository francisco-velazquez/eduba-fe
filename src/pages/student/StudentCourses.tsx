import { BookOpen, Play, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useStudentCourses, useCoursesProgress } from "@/hooks";
import { getCourseColor } from "@/services/api/student-subjects.api";
import { useNavigate } from "react-router-dom";
import { useMemo } from 'react';

export default function StudentCourses() {
  const { courses, currentGrade, isLoading, isError, error } = useStudentCourses();
  const navigate = useNavigate();

  // Get all course IDs for progress fetching
  const courseIds = useMemo(() => courses.map((c) => c.id), [courses]);
  
  // Fetch progress for all courses in parallel
  const { progressMap, isLoading: isLoadingProgress, isError: isProgressError } = useCoursesProgress(courseIds);

  // Format grade info for header
  const gradeInfo = currentGrade
    ? `${currentGrade.name} - ${currentGrade.code}`
    : "Sin grado asignado";

  const handleContinueCourse = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    const progress = progressMap[courseId];

    if (course && progress && course.modules) {
      console.log('Modules', course.modules)
      // Buscamos el último capitulo que vio el alumno y lo envíamos a ese
      const lastChapterId = progress.completedChapterIds[progress.completedChapterIds.length - 1];

      if (lastChapterId) {
        console.log('Next chapter found')
        navigate(`/alumno/curso/${courseId}?chapterId=${lastChapterId}`);
        return;
      }
    }
    
    navigate(`/alumno/curso/${courseId}`);
  };

  // Helper to get course progress from the progress map
  const getCourseProgress = (courseId: number) => {
    const progress = progressMap[courseId];
    return progress?.progressPercentage ?? 0;
  };

  const getLastAccessed = (courseId: number) => {
    const lastAccessed = progressMap[courseId]?.lastActivityAt;
    return lastAccessed ? new Date(lastAccessed).toLocaleDateString() : "Sin acceder";
  };

  const getCompletedModules = (courseId: number, totalModules: number) => {
    const progress = progressMap[courseId];
    if (!progress || progress.totalChapters === 0) return 0;
    // Estimate completed modules based on chapter completion ratio
    const ratio = progress.completedChapters / progress.totalChapters;
    return Math.floor(ratio * totalModules);
  };

  if (isLoading || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || isProgressError) {
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
            const progressPercentage = getCourseProgress(course.id);
            const isCompleted = progressPercentage === 100;

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
                      <span className="font-medium text-foreground">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {getCompletedModules(course.id, course.totalModules)} de {course.totalModules} módulos completados
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
                      {getLastAccessed(course.id)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleContinueCourse(course.id)}
                      disabled={course.totalModules === 0}
                      className={isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {course.totalModules > 0 ? (isCompleted ? "Completado" : progressPercentage > 0 ? "Continuar" : "Iniciar") : "Próximamente"}
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
