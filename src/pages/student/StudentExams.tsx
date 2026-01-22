import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Clock, CheckCircle, AlertCircle, Play, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { useStudentExamResults } from "@/hooks/useExams";

export default function StudentExams() {
  const navigate = useNavigate();
  const { courses, isLoading: coursesLoading } = useStudentCourses();
  const { data: results, isLoading: resultsLoading } = useStudentExamResults();

  const isLoading = coursesLoading || resultsLoading;

  // Get all available exams from courses
  const availableExams = courses?.flatMap((course) =>
    course.modules?.flatMap((module) => {
      return {
        moduleId: module.id,
        moduleName: module.title,
        subjectName: course.name,
        subjectId: course.id,
      };
    }) ?? []
  ) ?? [];

  // Get completed exams from results
  const completedExamIds = results?.map((r) => r.exam.id) ?? [];

  if (isLoading) {
    return <LoadingSpinner text="Cargando exámenes..." />;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Mis Exámenes"
        description="Revisa tus evaluaciones pendientes y resultados"
      />

      {/* Exam Results */}
      {results && results.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Exámenes Completados
          </h2>
          
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Examen</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Calificación</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{result.exam.title}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${
                        result.score >= 90 ? "bg-emerald-500/20 text-emerald-600" :
                        result.score >= 70 ? "bg-amber-500/20 text-amber-600" :
                        "bg-red-500/20 text-red-600"
                      }`}>
                        {result.score}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {result.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <Trophy className="h-4 w-4" />
                          Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          No aprobado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(result.submittedAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Available Courses with Exams */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Cursos con Exámenes Disponibles
        </h2>
        
        {courses && courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-card rounded-xl border border-border shadow-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.grade.name}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <FileQuestion className="h-5 w-5 text-violet-600" />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    {course.modules?.length ?? 0} módulos
                  </span>
                </div>

                <Button 
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  onClick={() => navigate(`/alumno/curso/${course.id}`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Ver Curso
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tienes cursos asignados"
            description="Contacta a tu administrador para que te asigne cursos"
            icon={FileQuestion}
          />
        )}
      </div>

      {/* No results message */}
      {(!results || results.length === 0) && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">Aún no has completado exámenes</p>
          <p className="text-sm text-muted-foreground">Los exámenes están disponibles dentro de cada curso</p>
        </div>
      )}
    </div>
  );
}
