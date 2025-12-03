import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courseContent = {
  name: "Matemáticas",
  teacher: "Prof. Juan García",
  progress: 65,
  modules: [
    {
      id: 1,
      name: "Módulo 1: Ecuaciones Lineales",
      completed: true,
      chapters: [
        {
          id: 1,
          name: "Introducción a las ecuaciones",
          completed: true,
          duration: "15:30",
          type: "video",
        },
        {
          id: 2,
          name: "Resolución de ecuaciones simples",
          completed: true,
          duration: "22:15",
          type: "video",
        },
        {
          id: 3,
          name: "Ejercicios prácticos",
          completed: true,
          type: "pdf",
        },
      ],
    },
    {
      id: 2,
      name: "Módulo 2: Sistemas de Ecuaciones",
      completed: false,
      chapters: [
        {
          id: 4,
          name: "Método de sustitución",
          completed: true,
          duration: "18:45",
          type: "video",
        },
        {
          id: 5,
          name: "Método de igualación",
          completed: false,
          duration: "20:00",
          type: "video",
          current: true,
        },
        {
          id: 6,
          name: "Ejercicios de sistemas",
          completed: false,
          type: "pdf",
        },
      ],
    },
    {
      id: 3,
      name: "Módulo 3: Ecuaciones Cuadráticas",
      completed: false,
      chapters: [
        {
          id: 7,
          name: "Introducción a cuadráticas",
          completed: false,
          duration: "25:00",
          type: "video",
        },
        {
          id: 8,
          name: "Fórmula general",
          completed: false,
          duration: "30:00",
          type: "video",
        },
      ],
    },
  ],
};

export default function StudentCourseViewer() {
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);
  const [selectedChapter, setSelectedChapter] = useState(5);

  const toggleModule = (id: number) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const currentChapter = courseContent.modules
    .flatMap((m) => m.chapters)
    .find((c) => c.id === selectedChapter);

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
            <h1 className="font-semibold text-foreground">{courseContent.name}</h1>
            <p className="text-xs text-muted-foreground">{courseContent.teacher}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{courseContent.progress}% completado</p>
            <Progress value={courseContent.progress} className="h-1.5 w-32" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <aside className="w-80 border-r border-border bg-card h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-foreground mb-4">Contenido del Curso</h2>
            
            <div className="space-y-2">
              {courseContent.modules.map((module) => (
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
                        {module.name}
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
                              {chapter.name}
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
                    <p className="text-white text-lg font-medium">{currentChapter.name}</p>
                    {currentChapter.duration && (
                      <p className="text-slate-400 text-sm mt-1">Duración: {currentChapter.duration}</p>
                    )}
                  </div>
                </div>

                {/* Lesson Info */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {currentChapter.name}
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
