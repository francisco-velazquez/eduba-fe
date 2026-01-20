import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Play,
  CheckCircle,
  Circle,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  Download,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/common";
import { useCourseDetails, useSubjectProgress, useCompleteChapter } from "@/hooks";
import type { CourseChapter } from "@/hooks/useCourseDetails";
import { VideoPlayer } from "@/components/video";

export default function StudentCourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapterIdParam = searchParams.get("chapterId");
  const courseId = parseInt(id || "0", 10);
  
  const { course, isLoading, isError, notFound } = useCourseDetails(courseId);
  
  // Fetch progress for this course
  const { progress } = useSubjectProgress(courseId);
  const completeChapterMutation = useCompleteChapter();
  
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  
  // Get all chapters flattened
  const allChapters = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m) => m.chapters);
  }, [course]);

  // Find the first non-completed chapter or the first chapter
  const initialChapterId = useMemo(() => {
    if (allChapters.length === 0) return 0;
    const currentChapter = allChapters.find((c) => c.current);
    if (currentChapter) return currentChapter.id;
    const firstIncomplete = allChapters.find((c) => !c.completed);
    return firstIncomplete?.id || allChapters[0]?.id || 0;
  }, [allChapters]);

  // Initialize expanded modules and selected chapter when course loads
  useMemo(() => {
    if (!course) return;

    // Si viene un chapterId en la URL, intentar seleccionarlo
    if (selectedChapter === 0 && chapterIdParam) {
      const paramId = parseInt(chapterIdParam, 10);
      if (!isNaN(paramId)) {
        const targetChapter = allChapters.find((c) => c.id === paramId);
        if (targetChapter) {
          setSelectedChapter(paramId);
          // Expandir el módulo correspondiente
          const module = course.modules.find((m) => m.chapters.some((c) => c.id === paramId));
          if (module && !expandedModules.includes(module.id)) {
            setExpandedModules((prev) => [...prev, module.id]);
          }
          return; // Salir para dar prioridad al parámetro de URL
        }
      }
    }

    if (course && expandedModules.length === 0) {
      const firstTwoModules = course.modules.slice(0, 2).map((m) => m.id);
      setExpandedModules(firstTwoModules);
    }
    if (initialChapterId && selectedChapter === 0) {
      setSelectedChapter(initialChapterId);
    }
  }, [course, expandedModules.length, initialChapterId, selectedChapter, chapterIdParam, allChapters]);

  // Current chapter
  const currentChapter: CourseChapter | undefined = useMemo(() => {
    return allChapters.find((c) => c.id === selectedChapter);
  }, [allChapters, selectedChapter]);

  // Find next chapter for navigation
  const nextChapter = useMemo(() => {
    const currentIndex = allChapters.findIndex((c) => c.id === selectedChapter);
    return currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  }, [allChapters, selectedChapter]);

  // Check if a chapter is completed based on progress data
  const isChapterCompleted = useCallback((chapterId: number): boolean => {
    return progress?.completedChapterIds?.includes(chapterId) ?? false;
  }, [progress]);

  // Calculate real progress
  const realProgress = progress?.progressPercentage ?? 0;

  // Handle marking chapter as complete
  const handleCompleteChapter = useCallback(async (chapterId: number) => {
    if (!isChapterCompleted(chapterId) && !completeChapterMutation.isPending) {
      await completeChapterMutation.mutateAsync(chapterId);
    }
  }, [isChapterCompleted, completeChapterMutation]);

  const handleVideoEnded = useCallback(() => {
    if (currentChapter && !isChapterCompleted(currentChapter.id)) {
      handleCompleteChapter(currentChapter.id);
    }
    if (nextChapter) {
      setSelectedChapter(nextChapter.id);
      const nextModule = course?.modules.find((m) => 
        m.chapters.some((c) => c.id === nextChapter.id)
      );
      if (nextModule && !expandedModules.includes(nextModule.id)) {
        setExpandedModules((prev) => [...prev, nextModule.id]);
      }
    }
  }, [currentChapter, isChapterCompleted, handleCompleteChapter, nextChapter, course, expandedModules]);

  const handleNextChapter = useCallback(() => {
    if (currentChapter && !isChapterCompleted(currentChapter.id)) {
      handleCompleteChapter(currentChapter.id);
    }
    if (nextChapter) {
      setSelectedChapter(nextChapter.id);
    }
  }, [currentChapter, isChapterCompleted, handleCompleteChapter, nextChapter]);

  const toggleModule = useCallback((moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError || notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {notFound ? "Curso no encontrado" : "Error al cargar el curso"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {notFound
              ? "El curso que buscas no existe o no tienes acceso."
              : "Ocurrió un error al cargar el contenido del curso."}
          </p>
          <Button onClick={() => navigate("/alumno/cursos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis cursos
          </Button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const renderContent = () => {
    if (!currentChapter) {
      return (
        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-white text-lg">Selecciona un capítulo para comenzar</p>
          </div>
        </div>
      );
    }

    // Video content
    if (currentChapter.type === "video" && currentChapter.videoUrl) {
      return (
        <VideoPlayer
          src={currentChapter.videoUrl}
          title={currentChapter.title}
          onEnded={handleVideoEnded}
          className="mb-6"
        />
      );
    }

    // PDF content
    if (currentChapter.type === "pdf" && currentChapter.contentUrl) {
      return (
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center mb-6 border border-border">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-foreground text-lg font-medium mb-2">{currentChapter.title}</p>
          <p className="text-muted-foreground text-sm mb-4">Documento PDF disponible</p>
          <div className="flex gap-2">
            <Button asChild>
              <a href={currentChapter.contentUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir PDF
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={currentChapter.contentUrl} download>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </a>
            </Button>
          </div>
        </div>
      );
    }

    // No content available
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="h-20 w-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Play className="h-10 w-10 text-violet-500" />
          </div>
          <p className="text-white text-lg font-medium">{currentChapter.title}</p>
          <p className="text-slate-400 text-sm mt-2">Contenido no disponible</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/alumno/cursos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a cursos
            </a>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-foreground">{course.name}</h1>
            <p className="text-xs text-muted-foreground">{course.grade.name} - {course.grade.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{realProgress}% completado</p>
            <Progress value={realProgress} className="h-1.5 w-32" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <aside className="w-80 border-r border-border bg-card h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-foreground mb-4">Contenido del Curso</h2>
            
            {course.modules.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay módulos disponibles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-border rounded-lg overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium text-foreground text-left">
                          {module.title}
                        </span>
                      </div>
                      {module.chapters.every((c) => isChapterCompleted(c.id)) && module.chapters.length > 0 && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                    </button>

                    {/* Chapters */}
                    {expandedModules.includes(module.id) && (
                      <div className="divide-y divide-border">
                        {module.chapters.length === 0 ? (
                          <div className="p-3 text-center">
                            <p className="text-xs text-muted-foreground">Sin capítulos</p>
                          </div>
                        ) : (
                          module.chapters.map((chapter) => (
                            <button
                              key={chapter.id}
                              onClick={() => setSelectedChapter(chapter.id)}
                              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                                selectedChapter === chapter.id
                                  ? "bg-violet-500/10 border-l-2 border-violet-500"
                                  : "hover:bg-muted/30"
                              }`}
                            >
                              {isChapterCompleted(chapter.id) ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                              ) : selectedChapter === chapter.id ? (
                                <Play className="h-4 w-4 text-violet-500 flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate ${
                                  selectedChapter === chapter.id ? "text-violet-600 font-medium" : "text-foreground"
                                }`}>
                                  {chapter.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {chapter.type === "video" ? (
                                    <>
                                      <Video className="h-3 w-3" />
                                      <span>Video</span>
                                    </>
                                  ) : chapter.type === "pdf" ? (
                                    <>
                                      <FileText className="h-3 w-3" />
                                      <span>PDF</span>
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-3 w-3" />
                                      <span>Contenido</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content - Video/Resource Viewer */}
        <main className="flex-1 h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-8">
            {renderContent()}

            {/* Lesson Info */}
            {currentChapter && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {currentChapter.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {currentChapter.description || 
                    "En esta lección aprenderás los conceptos fundamentales sobre el tema. Asegúrate de tomar notas y practicar los ejercicios."}
                </p>
                
                <div className="flex items-center gap-4 flex-wrap">
                  {isChapterCompleted(currentChapter.id) ? (
                    <Button variant="outline" className="text-emerald-600 border-emerald-600" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completado
                    </Button>
                  ) : (
                    <Button 
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={() => handleCompleteChapter(currentChapter.id)}
                      disabled={completeChapterMutation.isPending}
                    >
                      {completeChapterMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Marcar como completado
                    </Button>
                  )}
                  
                  {nextChapter && (
                    <Button variant="outline" onClick={handleNextChapter}>
                      Siguiente: {nextChapter.title}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {currentChapter.contentUrl && (
                    <Button variant="outline" asChild>
                      <a href={currentChapter.contentUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Material
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
