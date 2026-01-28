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
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { ExamDialog, ExamFormValues } from "@/components/dialogs/ExamDialog";
import { useCreateExam, useUpdateExam, useDeleteExam, useExamsForTeachers } from "@/hooks/useExams";
import { useTeacherSubjects } from "@/hooks/useSubjects";
import { AppExam, CreateExamDto } from "@/services/api/exams.api";

export default function TeacherExams() {
  const { data: subjects } = useTeacherSubjects();
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const deleteExam = useDeleteExam();

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<AppExam | null>(null);
  const [examToDelete, setExamToDelete] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [newExam, setNewExam] = useState(false);
  const [readonlyExam, setReadonlyExam] = useState(false);

  const subjectId = selectedSubject === "all" ? undefined : Number(selectedSubject);
  const { data: exams, isLoading } = useExamsForTeachers(subjectId);


  // Get all modules from all subjects for filtering
  const allModules = subjects?.flatMap((s) => 
    s.modules?.map((m) => ({ ...m, subjectName: s.nombre, subjectId: s.id })) ?? []
  ) ?? [];

  // Filter exams by selected subject
  const filteredExams = exams ?? [];

  const getModuleInfo = (moduleId: number) => {
    const module = allModules.find((m) => m.id === moduleId);
    return module ? { name: module.nombre, subject: module.subjectName } : null;
  };

  const handleCreateExam = () => {
    setSelectedExam(null);
    setSelectedModuleId(null);
    setIsExamDialogOpen(false);
    setNewExam(true)
  };

  const handleEditExam = (exam: AppExam) => {
    setSelectedExam(exam);
    setSelectedModuleId(exam.moduleId);
    setIsExamDialogOpen(true);
    setReadonlyExam(false);
  };

  const handleViewQuestions = (exam: AppExam) => {
    setSelectedExam(exam);
    setIsExamDialogOpen(true);
    setReadonlyExam(true);
  }

  const handleDeleteExam = (examId: number) => {
    setExamToDelete(examId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    await deleteExam.mutateAsync(examToDelete);
    setIsDeleteDialogOpen(false);
    setExamToDelete(null);
  };

  const handleSaveExam = async (values: ExamFormValues) => {
    if (selectedExam) {
      // Update existing exam
      await updateExam.mutateAsync({
        id: selectedExam.id,
        data: {
          title: values.title,
          questions: values.questions,
        },
      });
    } else if (selectedModuleId) {
      // Create new exam
      const createData: CreateExamDto = {
        title: values.title,
        moduleId: selectedModuleId,
        questions: values.questions,
      };
      await createExam.mutateAsync(createData);
    }
    setIsExamDialogOpen(false);
    setSelectedExam(null);
    setSelectedModuleId(null);
    setNewExam(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando exámenes..." />;
  }

  return (
    <>
      <ExamDialog
        open={isExamDialogOpen}
        onOpenChange={(open) => {
          setIsExamDialogOpen(open);
          if (!open) {
            setSelectedExam(null);
            setSelectedModuleId(null);
          }
        }}
        onSubmit={handleSaveExam}
        isSubmitting={createExam.isPending || updateExam.isPending}
        mode={readonlyExam ? 'readonly' : (selectedExam ? "edit" : "create")}
        initialData={selectedExam}
        moduleName={
          selectedModuleId
            ? getModuleInfo(selectedModuleId)?.name
            : undefined
        }
      />
      
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Eliminar Examen"
        description="¿Estás seguro de que deseas eliminar este examen? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        isLoading={deleteExam.isPending}
        variant="destructive"
        confirmText="Eliminar"
      />

      <div className="space-y-6">
        <PageHeader
          title="Exámenes"
          description="Crea y gestiona evaluaciones para tus alumnos"
          actions={
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCreateExam}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Examen
            </Button>
          }
        />

        {/* Filter */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Filtrar por:</span>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Seleccionar asignatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las asignaturas</SelectItem>
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={String(subject.id)}>
                    {subject.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Module Selection for New Exam */}
        {newExam && !isExamDialogOpen && !selectedExam && !selectedModuleId && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Selecciona un módulo para el examen</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {allModules.map((module) => {
                const hasExam = exams?.some((e) => e.moduleId === module.id);
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      if (!hasExam) {
                        setSelectedModuleId(module.id);
                        setIsExamDialogOpen(true);
                        setNewExam(false);
                      }
                    }}
                    disabled={hasExam}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      hasExam
                        ? "bg-muted/50 border-border cursor-not-allowed opacity-60"
                        : "bg-card border-border hover:border-emerald-500 hover:bg-emerald-500/10"
                    }`}
                  >
                    <p className="font-medium text-foreground">{module.nombre}</p>
                    <p className="text-sm text-muted-foreground">{module.subjectName}</p>
                    {hasExam && (
                      <span className="text-xs text-amber-600 mt-1 block">
                        Ya tiene examen
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {allModules.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No hay módulos disponibles. Crea módulos en tus asignaturas primero.
              </p>
            )}
          </div>
        )}

        {/* Exams List */}
        {filteredExams.length > 0 ? (
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const moduleInfo = getModuleInfo(exam.moduleId);
              return (
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
                          <h3 className="font-semibold text-foreground">{exam.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {moduleInfo?.subject} • {moduleInfo?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileQuestion className="h-4 w-4" />
                            {exam.questionsCount} preguntas
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewQuestions(exam)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Preguntas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditExam(exam)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteExam(exam.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No hay exámenes"
            description="Crea tu primer examen para evaluar a tus alumnos"
            icon={FileQuestion}
            action={
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCreateExam}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Examen
              </Button>
            }
          />
        )}
      </div>
    </>
  );
}
