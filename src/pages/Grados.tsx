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
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useGrades, useDeleteGrade } from "@/hooks/useGrades";
import type { AppGrade } from "@/services/api/grades.api";

export default function Grados() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: grados = [], isLoading, error } = useGrades();
  const deleteGrade = useDeleteGrade();

  const primaria = grados.filter((g) => g.nivel?.toLowerCase().includes("primaria"));
  const secundaria = grados.filter((g) => g.nivel?.toLowerCase().includes("secundaria"));

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este grado?")) {
      deleteGrade.mutate(id);
    }
  };

  const GradoCard = ({ grado, index }: { grado: AppGrade; index: number }) => (
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
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => handleDelete(String(grado.id))}
            >
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Error al cargar grados"
        description={error.message}
      />
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Grados Académicos"
        description="Administra los grados y niveles educativos"
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="gradient-primary border-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Grado
          </Button>
        }
      />

      {grados.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No hay grados"
          description="Agrega tu primer grado académico para comenzar"
        />
      ) : (
        <>
          {/* Primaria Section */}
          {primaria.length > 0 && (
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
          )}

          {/* Secundaria Section */}
          {secundaria.length > 0 && (
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
          )}
        </>
      )}

      <GradoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
