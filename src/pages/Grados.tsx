import { useState } from "react";
import { Plus, Users, BookOpen, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradoDialog } from "@/components/dialogs/GradoDialog";

const gradosData = [
  { id: 1, nombre: "1° Primaria", nivel: "Primaria", alumnos: 32, asignaturas: 8 },
  { id: 2, nombre: "2° Primaria", nivel: "Primaria", alumnos: 28, asignaturas: 8 },
  { id: 3, nombre: "3° Primaria", nivel: "Primaria", alumnos: 35, asignaturas: 9 },
  { id: 4, nombre: "4° Primaria", nivel: "Primaria", alumnos: 30, asignaturas: 9 },
  { id: 5, nombre: "5° Primaria", nivel: "Primaria", alumnos: 27, asignaturas: 10 },
  { id: 6, nombre: "6° Primaria", nivel: "Primaria", alumnos: 31, asignaturas: 10 },
  { id: 7, nombre: "1° Secundaria", nivel: "Secundaria", alumnos: 45, asignaturas: 12 },
  { id: 8, nombre: "2° Secundaria", nivel: "Secundaria", alumnos: 42, asignaturas: 12 },
  { id: 9, nombre: "3° Secundaria", nivel: "Secundaria", alumnos: 38, asignaturas: 12 },
];

export default function Grados() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const primaria = gradosData.filter((g) => g.nivel === "Primaria");
  const secundaria = gradosData.filter((g) => g.nivel === "Secundaria");

  const GradoCard = ({ grado, index }: { grado: (typeof gradosData)[0]; index: number }) => (
    <div
      className="stat-card group animate-fade-in p-4 md:p-6"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base md:text-lg">{grado.nombre}</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">{grado.nivel}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

      <div className="mt-4 md:mt-6 flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
            <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold text-foreground">{grado.alumnos}</p>
            <p className="text-xs text-muted-foreground">Alumnos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 rounded-lg bg-accent/10">
            <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold text-foreground">{grado.asignaturas}</p>
            <p className="text-xs text-muted-foreground">Asignaturas</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            Grados Académicos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los grados y niveles educativos
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary border-0 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Grado
        </Button>
      </div>

      {/* Primaria Section */}
      <div>
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
          Nivel Primaria
        </h2>
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {primaria.map((grado, index) => (
            <GradoCard key={grado.id} grado={grado} index={index} />
          ))}
        </div>
      </div>

      {/* Secundaria Section */}
      <div>
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
          Nivel Secundaria
        </h2>
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {secundaria.map((grado, index) => (
            <GradoCard key={grado.id} grado={grado} index={index + primaria.length} />
          ))}
        </div>
      </div>

      <GradoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
