import { BookOpen, FolderOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTeacher } from "@/hooks/useTeachers";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { AppSubject } from "@/services/api/subjects.api";

// Helper to get a consistent color from the subject's color property
const getSubjectColor = (subject: AppSubject) => {
  if (!subject.color) return "bg-gray-500";
  // Assuming color is stored like "bg-blue-500"
  return subject.color.startsWith("bg-") ? subject.color : `bg-${subject.color}-500`;
};

export default function TeacherSubjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: teacher, isLoading, isError } = useTeacher(user?.id ?? "");

  if (isLoading) {
    return <LoadingSpinner text="Cargando asignaturas..." />;
  }

  if (isError || !teacher) {
    return (
      <EmptyState
        title="Error"
        description="No se pudieron cargar las asignaturas. Por favor, intenta de nuevo más tarde."
        icon={BookOpen}
      />
    );
  }

  const assignedSubjects = teacher.asignaturas;

  const handleManageSubject = (subjectId: string) => {
    navigate(`/maestro/asignaturas/${subjectId}/contenido`);
  };

  if (assignedSubjects.length === 0) {
    return (
      <>
        <PageHeader
          title="Mis Asignaturas"
          description="Gestiona tus materias y contenido educativo"
        />
        <EmptyState
          title="No tienes asignaturas"
          description="Aún no se te ha asignado ninguna materia. Contacta al administrador."
          icon={BookOpen}
        />
      </>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Mis Asignaturas"
        description="Gestiona tus materias y contenido educativo"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedSubjects.map((subject: AppSubject) => (
          <div
            key={subject.id}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`h-2 ${getSubjectColor(subject)}`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{subject.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{subject.grados.join(", ")}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${getSubjectColor(subject)?.replace("bg-", "bg-opacity-20 text-")} flex items-center justify-center`}>
                  <BookOpen className={`h-5 w-5 ${getSubjectColor(subject)?.replace("bg-", "text-")}`} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">N/A</p>
                  <p className="text-xs text-muted-foreground">Alumnos</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <FolderOpen className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">N/A</p>
                  <p className="text-xs text-muted-foreground">Módulos</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <BookOpen className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">N/A</p>
                  <p className="text-xs text-muted-foreground">Capítulos</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso del curso</span>
                  <span className="font-medium text-foreground">N/A</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getSubjectColor(subject)} rounded-full transition-all`}
                    style={{ width: `0%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleManageSubject(String(subject.id))}
                >
                  Gestionar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
