import { BookOpen, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

const subjects = [
  {
    id: 1,
    name: "Matemáticas",
    grade: "3° Secundaria",
    students: 32,
    modules: 5,
    chapters: 18,
    progress: 75,
    color: "emerald",
  },
  {
    id: 2,
    name: "Álgebra",
    grade: "2° Secundaria",
    students: 28,
    modules: 4,
    chapters: 12,
    progress: 60,
    color: "blue",
  },
  {
    id: 3,
    name: "Geometría",
    grade: "1° Secundaria",
    students: 35,
    modules: 3,
    chapters: 9,
    progress: 45,
    color: "violet",
  },
];

export default function TeacherSubjects() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Mis Asignaturas"
        description="Gestiona tus materias y contenido educativo"
      />

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header with color */}
            <div className={`h-2 bg-${subject.color}-500`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subject.grade}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-${subject.color}-500/20 flex items-center justify-center`}>
                  <BookOpen className={`h-5 w-5 text-${subject.color}-600`} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">{subject.students}</p>
                  <p className="text-xs text-muted-foreground">Alumnos</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <FolderOpen className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">{subject.modules}</p>
                  <p className="text-xs text-muted-foreground">Módulos</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <BookOpen className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">{subject.chapters}</p>
                  <p className="text-xs text-muted-foreground">Capítulos</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso del curso</span>
                  <span className="font-medium text-foreground">{subject.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${subject.color}-500 rounded-full transition-all`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Contenido
                </Button>
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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
