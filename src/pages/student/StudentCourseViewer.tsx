import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/common";
import { useCourseDetails, CourseChapter } from "@/hooks/useCourseDetails";

export default function StudentCourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || "0", 10);
  
  const { course, isLoading, isError, notFound } = useCourseDetails(courseId);

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

  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);

  // Initialize expanded modules and selected chapter when course loads
  useMemo(() => {
    if (course && expandedModules.length === 0) {
      // Expand first two modules by default
      const firstTwoModules = course.modules.slice(0, 2).map((m) => m.id);
      setExpandedModules(firstTwoModules);
    }
    if (initialChapterId && selectedChapter === 0) {
      setSelectedChapter(initialChapterId);
    }
  }, [course, initialChapterId]);

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

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  const currentChapter: CourseChapter | undefined = allChapters.find(
    (c) => c.id === selectedChapter
  );

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
            <p className="text-sm font-medium text-foreground">{course.progress}% completado</p>
            <Progress value={course.progress} className="h-1.5 w-32" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <aside className="w-80 border-r border-border bg-card h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-foreground mb-4">Contenido del Curso</h2>
            
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
                    {module.completed && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                  </button>

                  {/* Chapters */}
                  {expandedModules.includes(module.id) && (
                    <div className="divide-y divide-border">
                      {module.chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => setSelectedChapter(chapter.id)}
                          className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                            selectedChapter === chapter.id
                              ? "bg-violet-500/10 border-l-2 border-violet-500"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          {chapter.completed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : chapter.current ? (
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
                                  {chapter.duration}
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3 w-3" />
                                  PDF
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Video/Resource Viewer */}
        <main className="flex-1 h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-8">
            {currentChapter && (
              <>
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="h-10 w-10 text-violet-500" />
                    </div>
                    <p className="text-white text-lg font-medium">{currentChapter.title}</p>
                    {currentChapter.duration && (
                      <p className="text-slate-400 text-sm mt-1">Duración: {currentChapter.duration}</p>
                    )}
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {currentChapter.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    En esta lección aprenderás los conceptos fundamentales sobre el tema. 
                    Asegúrate de tomar notas y practicar los ejercicios.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      <Play className="h-4 w-4 mr-2" />
                      {currentChapter.completed ? "Ver de nuevo" : "Comenzar"}
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Material
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
