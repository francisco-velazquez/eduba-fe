import { useState } from "react";
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
  { id: "1", name: "Matemáticas - 3° Secundaria" },
  { id: "2", name: "Álgebra - 2° Secundaria" },
  { id: "3", name: "Geometría - 1° Secundaria" },
];

const contentStructure = [
  {
    id: 1,
    name: "Módulo 1: Ecuaciones Lineales",
    chapters: [
      {
        id: 1,
        name: "Introducción a las ecuaciones",
        resources: [
          { type: "video", name: "Video explicativo", duration: "15:30" },
          { type: "pdf", name: "Guía de estudio", size: "2.4 MB" },
        ],
      },
      {
        id: 2,
        name: "Resolución de ecuaciones simples",
        resources: [
          { type: "video", name: "Ejemplos prácticos", duration: "22:15" },
          { type: "ppt", name: "Presentación", size: "5.1 MB" },
          { type: "pdf", name: "Ejercicios", size: "1.2 MB" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Módulo 2: Sistemas de Ecuaciones",
    chapters: [
      {
        id: 3,
        name: "Métodos de sustitución",
        resources: [
          { type: "video", name: "Método de sustitución", duration: "18:45" },
        ],
      },
    ],
  },
];

export default function TeacherContent() {
  const [selectedSubject, setSelectedSubject] = useState("1");
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Gestión de Contenido</h1>
          <p className="page-description">
            Organiza módulos, capítulos y recursos de tus asignaturas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Subir Recurso
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Módulo
          </Button>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Asignatura:</span>
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

      {/* Content Structure */}
      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Estructura del Curso</h3>
        </div>

        <div className="divide-y divide-border">
          {contentStructure.map((module) => (
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
                  <span className="font-medium text-foreground">{module.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({module.chapters.length} capítulos)
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Capítulo
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Módulo
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Chapters */}
              {expandedModules.includes(module.id) && (
                <div className="bg-muted/20">
                  {module.chapters.map((chapter) => (
                    <div key={chapter.id}>
                      {/* Chapter Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-muted/30 cursor-pointer"
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedChapters.includes(chapter.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="h-7 w-7 rounded bg-blue-500/20 flex items-center justify-center">
                            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {chapter.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({chapter.resources.length} recursos)
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Upload className="h-4 w-4 mr-2" />
                              Subir Recurso
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar Capítulo
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Resources */}
                      {expandedChapters.includes(chapter.id) && (
                        <div className="pl-20 pr-4 pb-3 space-y-2">
                          {chapter.resources.map((resource, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                            >
                              <div className="flex items-center gap-3">
                                {getResourceIcon(resource.type)}
                                <span className="text-sm text-foreground">{resource.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {"duration" in resource ? resource.duration : resource.size}
                              </span>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Recurso
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
