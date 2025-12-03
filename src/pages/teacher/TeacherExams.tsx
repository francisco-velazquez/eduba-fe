import { useState } from "react";
import {
  FileQuestion,
  Plus,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  BarChart,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const subjects = [
  { id: "all", name: "Todas las asignaturas" },
  { id: "1", name: "Matemáticas - 3° Secundaria" },
  { id: "2", name: "Álgebra - 2° Secundaria" },
  { id: "3", name: "Geometría - 1° Secundaria" },
];

const exams = [
  {
    id: 1,
    name: "Examen Parcial - Ecuaciones Lineales",
    subject: "Matemáticas",
    grade: "3° Secundaria",
    questions: 20,
    duration: 45,
    status: "active",
    submitted: 20,
    total: 32,
    avgScore: 8.2,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Quiz - Factorización",
    subject: "Álgebra",
    grade: "2° Secundaria",
    questions: 10,
    duration: 20,
    status: "completed",
    submitted: 28,
    total: 28,
    avgScore: 7.8,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Examen Final - Primer Trimestre",
    subject: "Geometría",
    grade: "1° Secundaria",
    questions: 30,
    duration: 60,
    status: "draft",
    submitted: 0,
    total: 35,
    avgScore: null,
    createdAt: "2024-01-20",
  },
];

export default function TeacherExams() {
  const [selectedSubject, setSelectedSubject] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Borrador
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Exámenes</h1>
          <p className="page-description">
            Crea y gestiona evaluaciones para tus alumnos
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear Examen
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Filtrar por:</span>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Seleccionar asignatura" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-card rounded-xl border border-border shadow-card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileQuestion className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">{exam.name}</h3>
                    {getStatusBadge(exam.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exam.subject} • {exam.grade}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      {exam.questions} preguntas
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exam.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {exam.submitted}/{exam.total} respondieron
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {exam.avgScore !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{exam.avgScore}</p>
                    <p className="text-xs text-muted-foreground">Promedio</p>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Preguntas
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart className="h-4 w-4 mr-2" />
                      Ver Resultados
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
