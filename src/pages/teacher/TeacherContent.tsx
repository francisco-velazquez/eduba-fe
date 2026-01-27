import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  FolderOpen,
  FileText,
  Video,
  FileImage,
  Plus,
  ChevronRight,
  ChevronDown,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  GripVertical,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useSubject } from "@/hooks/useSubjects";
import { useCreateModule, useUpdateModule } from "@/hooks/useModules";
import { useCreateChapter, useReorderChapters, useUpdateChapter } from "@/hooks/useChapters";
import { useCreateExam, useUpdateExam, useDeleteExam } from "@/hooks/useExams";
import { ModuleDialog, ModuleFormValues } from "@/components/dialogs/ModuleDialog";
import { uploadChapterFile, chaptersApi } from "@/services/api/chapters.api";
import { ChapterDialog, ChapterFormValues } from "@/components/dialogs/ChapterDialog";
import { ExamDialog, ExamFormValues } from "@/components/dialogs/ExamDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { ModuleExamMenu } from "@/components/teacher/ModuleExamMenu";
import { AppChapter, AppModule, modulesApi } from "@/services/api/modules.api";
import { AppExam, CreateExamDto } from "@/services/api/exams.api";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";

export default function TeacherContent() {
  const { id_asignatura } = useParams<{ id_asignatura: string }>();
  const { data: subject, isLoading, isError, refetch } = useSubject(id_asignatura ?? "");
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const reorderChapters = useReorderChapters();
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const deleteExam = useDeleteExam();

  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false);
  const [isDeleteExamDialogOpen, setIsDeleteExamDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [moduleToEdit, setModuleToEdit] = useState<AppModule | null>(null);
  const [chapterToEdit, setChapterToEdit] = useState<AppChapter | null>(null);
  const [examToEdit, setExamToEdit] = useState<AppExam | null>(null);
  const [examToDelete, setExamToDelete] = useState<number | null>(null);
  const [selectedModuleForExam, setSelectedModuleForExam] = useState<AppModule | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [isDeletingExam, setIsDeletingExam] = useState(false);

  const filteredModules = subject?.modules?.filter((module) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchModule = module.nombre.toLowerCase().includes(query);
    const matchChapter = module.chapters?.some((chapter) =>
      chapter.title.toLowerCase().includes(query)
    );
    return matchModule || matchChapter;
  }) || [];

  const toggleModule = (id: number) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSaveModule = (values: ModuleFormValues) => {
    if (moduleToEdit) {
      // Update existing module
      updateModule.mutate(
        {
          id: moduleToEdit.id,
          data: {
            title: values.title,
            description: values.description,
            isPublished: values.isPublished,
          },
        },
        {
          onSuccess: () => {
            setIsModuleDialogOpen(false);
            setModuleToEdit(null);
            refetch();
          },
        }
      );
    } else {
      // Create new module
      if (!id_asignatura || !subject) return;
      const orderIndex = (subject.modules?.length ?? 0) + 1;

      createModule.mutate(
        {
          title: values.title,
          description: values.description,
          isPublished: values.isPublished,
          subjectId: parseInt(id_asignatura, 10),
          orderIndex,
        },
        {
          onSuccess: () => {
            setIsModuleDialogOpen(false);
            refetch();
          },
        }
      );
    }
  };

  const handlePublishToggle = (moduleId: number, isPublished: boolean) => {
    updateModule.mutate({ id: moduleId, data: { isPublished } });
  };

  const handleOpenChapterDialog = (moduleId: number) => {
    setChapterToEdit(null);
    setSelectedModuleId(moduleId);
    setIsChapterDialogOpen(true);
  };

  const handleSaveChapter = async (values: ChapterFormValues) => {
    if (!subject) return;

    setIsSubmitting(true);
    try {
      if (chapterToEdit) {
        // Edit existing chapter
        await updateChapter.mutateAsync({
          id: chapterToEdit.id,
          data: {
            title: values.title,
            isPublished: values.isPublished,
            videoUrl: values.videoUrl || null,
          },
        });

        if (!values.videoUrl && values.videoFile) {
          await uploadChapterFile(chapterToEdit.id, values.videoFile, "video");
        }

        if (values.contentFile) {
          await uploadChapterFile(chapterToEdit.id, values.contentFile, "content");
        }
      } else {
        // Create new chapter
        if (!selectedModuleId) return;
        const module = subject.modules?.find((m) => m.id === selectedModuleId);
        const orderIndex = (module?.chapters?.length ?? 0) + 1;

        const newChapter = await createChapter.mutateAsync({
          title: values.title,
          moduleId: selectedModuleId,
          orderIndex,
          isPublished: values.isPublished,
          videoUrl: values.videoUrl,
        });

        if (!values.videoUrl && values.videoFile) {
          await uploadChapterFile(newChapter.data.id, values.videoFile, "video");
        }

        if (values.contentFile) {
          await uploadChapterFile(newChapter.data.id, values.contentFile, "content");
        }
      }

      setIsChapterDialogOpen(false);
      setChapterToEdit(null);
      refetch();
    } catch (error) {
      console.error("Error saving chapter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChapter = (chapterId: number) => {
    setChapterToDelete(chapterId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteChapter = async () => {
    if (!chapterToDelete) return;

    setIsDeleting(true);
    try {
      await chaptersApi.delete(chapterToDelete);
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModule = (moduleId: number) => {
    setModuleToDelete(moduleId);
    setIsDeleteModuleDialogOpen(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return;

    setIsDeletingModule(true);
    try {
      await modulesApi.delete(moduleToDelete);
      refetch();
      setIsDeleteModuleDialogOpen(false);
    } catch (error) {
      console.error("Error deleting module:", error);
    } finally {
      setIsDeletingModule(false);
    }
  };

  const handleEditModule = (module: AppModule) => {
    setModuleToEdit(module);
    setIsModuleDialogOpen(true);
  };

  const handleEditChapter = (chapter: AppChapter) => {
    setChapterToEdit(chapter);
    setIsChapterDialogOpen(true);
  };

  const handleOpenExamDialog = async (module: AppModule, existingExam?: AppExam | null) => {
    setSelectedModuleForExam(module);
    if (existingExam) {
      setExamToEdit(existingExam);
    } else {
      setExamToEdit(null);
    }
    setIsExamDialogOpen(true);
  };

  const handleSaveExam = async (values: ExamFormValues) => {
    if (!selectedModuleForExam) return;

    try {
      if (examToEdit) {
        await updateExam.mutateAsync({
          id: examToEdit.id,
          data: {
            title: values.title,
            questions: values.questions,
          },
        });
        toast.success("Examen actualizado correctamente");
      } else {
        const examData: CreateExamDto = {
          title: values.title,
          moduleId: selectedModuleForExam.id,
          questions: values.questions,
        };
        await createExam.mutateAsync(examData);
        toast.success("Examen creado correctamente");
      }
      setIsExamDialogOpen(false);
      setExamToEdit(null);
      setSelectedModuleForExam(null);
    } catch (error: any) {
      if (error?.message?.includes("ya tiene un examen")) {
        toast.error("Este módulo ya tiene un examen asignado");
      } else {
        toast.error("Error al guardar el examen");
      }
    }
  };

  const handleDeleteExam = (examId: number) => {
    setExamToDelete(examId);
    setIsDeleteExamDialogOpen(true);
  };

  const confirmDeleteExam = async () => {
    if (!examToDelete) return;

    setIsDeletingExam(true);
    try {
      await deleteExam.mutateAsync(examToDelete);
      toast.success("Examen eliminado correctamente");
      setIsDeleteExamDialogOpen(false);
      setExamToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar el examen");
    } finally {
      setIsDeletingExam(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const moduleId = parseInt(result.source.droppableId);

    if (sourceIndex === destinationIndex) return;

    const module = subject?.modules?.find((m) => m.id === moduleId);
    if (!module || !module.chapters) return;

    const newChapters = Array.from(module.chapters);
    const [reorderedChapter] = newChapters.splice(sourceIndex, 1);
    newChapters.splice(destinationIndex, 0, reorderedChapter);

    const chapterIds = newChapters.map((c) => c.id);
    reorderChapters.mutate({ moduleId, chapterIds });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-red-500" />;
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "ppt":
        return <FileImage className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando contenido..." />;
  }

  if (isError || !subject) {
    return (
      <EmptyState
        title="Error"
        description="No se pudo cargar el contenido de la asignatura. Por favor, intenta de nuevo más tarde."
        icon={BookOpen}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ModuleDialog
        open={isModuleDialogOpen}
        onOpenChange={(open) => {
          setIsModuleDialogOpen(open);
          if (!open) setModuleToEdit(null);
        }}
        onSubmit={handleSaveModule}
        isSubmitting={createModule.isPending || updateModule.isPending}
        initialValues={moduleToEdit ? {
          title: moduleToEdit.nombre,
          description: moduleToEdit.descripcion,
          isPublished: moduleToEdit.isPublished
        } : undefined}
        mode={moduleToEdit ? "edit" : "create"}
      />
      <ChapterDialog
        open={isChapterDialogOpen}
        onOpenChange={(open) => {
          setIsChapterDialogOpen(open);
          if (!open) setChapterToEdit(null);
        }}
        onSubmit={handleSaveChapter}
        isSubmitting={isSubmitting}
        mode={chapterToEdit ? "edit" : "create"}
        initialData={chapterToEdit ? {
          title: chapterToEdit.title,
          isPublished: chapterToEdit.isPublished,
          videoUrl: chapterToEdit.videoUrl,
          contentUrl: chapterToEdit.contentUrl
        } : null}
      />
      <ExamDialog
        open={isExamDialogOpen}
        onOpenChange={(open) => {
          setIsExamDialogOpen(open);
          if (!open) {
            setExamToEdit(null);
            setSelectedModuleForExam(null);
          }
        }}
        onSubmit={handleSaveExam}
        isSubmitting={createExam.isPending || updateExam.isPending}
        mode={examToEdit ? "edit" : "create"}
        initialData={examToEdit}
        moduleName={selectedModuleForExam?.nombre}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Eliminar Capítulo"
        description="¿Estás seguro de que deseas eliminar este capítulo? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteChapter}
        isLoading={isDeleting}
        variant="destructive"
        confirmText="Eliminar"
      />
      <ConfirmDialog
        open={isDeleteModuleDialogOpen}
        onOpenChange={setIsDeleteModuleDialogOpen}
        title="Eliminar Módulo"
        description="¿Estás seguro de que deseas eliminar este módulo? Se eliminarán todos los capítulos y recursos asociados. Esta acción no se puede deshacer."
        onConfirm={confirmDeleteModule}
        isLoading={isDeletingModule}
        variant="destructive"
        confirmText="Eliminar"
      />
      <ConfirmDialog
        open={isDeleteExamDialogOpen}
        onOpenChange={setIsDeleteExamDialogOpen}
        title="Eliminar Examen"
        description="¿Estás seguro de que deseas eliminar este examen? Los resultados de los alumnos también se eliminarán. Esta acción no se puede deshacer."
        onConfirm={confirmDeleteExam}
        isLoading={isDeletingExam}
        variant="destructive"
        confirmText="Eliminar"
      />
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Contenido"
          description="Organiza módulos, capítulos y recursos de tus asignaturas"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Subir Recurso
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setModuleToEdit(null);
                  setIsModuleDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Módulo
              </Button>
            </div>
          }
        />

        {/* Subject Info */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Asignatura:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{subject.nombre}</span>
              <span className="text-sm text-muted-foreground">({subject.grados.join(", ")})</span>
            </div>
          </div>
        </div>

        {/* Content Structure */}
        <div className="bg-card rounded-xl border border-border shadow-card">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-foreground">Estructura del Curso</h3>
            {subject?.modules && subject.modules.length > 0 && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contenido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            )}
          </div>

          {subject.modules && subject.modules.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                <div key={module.id}>
                  {/* Module Header */}
                  <div
                    className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FolderOpen className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-foreground">{module.nombre}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {module.chapters?.length || 0} capítulos
                      </span>
                      <Switch
                        checked={module.isPublished}
                        onCheckedChange={(checked) => handlePublishToggle(module.id, checked)}
                        onClick={(e) => e.stopPropagation()} // Prevent module expansion when clicking switch
                        aria-label="Toggle module publication status"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenChapterDialog(module.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Capítulo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditModule(module)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Módulo
                        </DropdownMenuItem>
                        <ModuleExamMenu
                          module={module}
                          onCreateExam={(mod) => handleOpenExamDialog(mod, null)}
                          onEditExam={(mod, exam) => handleOpenExamDialog(mod, exam)}
                          onDeleteExam={handleDeleteExam}
                        />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Chapters */}
                  {expandedModules.includes(module.id) && (
                    <div className="bg-muted/20 border-t border-border">
                      {module.chapters && module.chapters.length > 0 ? (
                        <Droppable droppableId={String(module.id)}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="divide-y divide-border/50"
                            >
                              {module.chapters?.map((chapter: AppChapter, index: number) => (
                                <Draggable key={chapter.id} draggableId={String(chapter.id)} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center justify-between p-3 pl-4 hover:bg-muted/40 transition-colors bg-card"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                                          <GripVertical className="h-4 w-4" />
                                        </div>
                                        <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center">
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                              {chapter.title}
                                            </span>
                                            {!chapter.isPublished && (
                                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                                Borrador
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            {chapter.videoUrl && (
                                              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                                <Video className="h-3 w-3" />
                                                Video
                                              </span>
                                            )}
                                            {chapter.contentUrl && (
                                              <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full">
                                                <FileText className="h-3 w-3" />
                                                Material
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => handleEditChapter(chapter)}
                                        >
                                          <Edit className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            onClick={() => handleDeleteChapter(chapter.id)}
                                          >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            No hay capítulos en este módulo.
                          </p>
                          <Button 
                            variant="link" 
                            className="text-emerald-600 mt-1 h-auto p-0"
                            onClick={() => {
                              setChapterToEdit(null);
                              handleOpenChapterDialog(module.id);
                            }}
                          >
                            Agregar el primer capítulo
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No hay módulos en esta asignatura.</p>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
