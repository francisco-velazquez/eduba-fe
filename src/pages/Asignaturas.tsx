import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AsignaturaDialog } from "@/components/dialogs/AsignaturaDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useSubjects, useDeleteSubject } from "@/hooks/useSubjects";
import type { AppSubject } from "@/services/api/subjects.api";

export default function Asignaturas() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsignatura, setSelectedAsignatura] = useState<AppSubject | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [asignaturaToDelete, setAsignaturaToDelete] = useState<AppSubject | null>(null);

  const { data: asignaturas = [], isLoading, error } = useSubjects();
  const deleteSubject = useDeleteSubject();

  const filteredAsignaturas = asignaturas.filter(
    (a) =>
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.maestro.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (asignatura: AppSubject) => {
    setSelectedAsignatura(asignatura);
    setDialogOpen(true);
  };

  const handleDelete = (asignatura: AppSubject) => {
    setAsignaturaToDelete(asignatura);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (asignaturaToDelete) {
      await deleteSubject.mutateAsync(String(asignaturaToDelete.id));
      setDeleteDialogOpen(false);
      setAsignaturaToDelete(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedAsignatura(null);
    }
  };

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
        icon={GraduationCap}
        title="Error al cargar asignaturas"
        description={error.message}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Asignaturas"
        description="Gestiona las materias del plan de estudios"
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="gradient-primary border-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Asignatura
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar asignaturas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {asignaturas.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No hay asignaturas"
          description="Crea tu primera asignatura para comenzar"
        />
      ) : filteredAsignaturas.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Sin resultados"
          description="No se encontraron asignaturas con ese criterio de búsqueda"
        />
      ) : (
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAsignaturas.map((asignatura, index) => (
            <SubjectCard 
              key={asignatura.id} 
              asignatura={asignatura} 
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AsignaturaDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        asignatura={selectedAsignatura}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Asignatura"
        description={`¿Estás seguro de eliminar "${asignaturaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleteSubject.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function SubjectCard({ 
  asignatura, 
  index,
  onEdit,
  onDelete,
}: { 
  asignatura: AppSubject; 
  index: number;
  onEdit: (asignatura: AppSubject) => void;
  onDelete: (asignatura: AppSubject) => void;
}) {
  return (
    <div
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden group animate-fade-in hover:shadow-elevated transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Color Header */}
      <div className={`h-2 ${asignatura.color}`} />

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm md:text-base">
              {asignatura.nombre}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
              {asignatura.descripcion}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(asignatura)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(asignatura)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-2 mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{asignatura.maestro}</span>
        </div>

        {/* Grades */}
        {asignatura.grados.length > 0 && (
          <div className="mt-3 md:mt-4">
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>Grados asignados</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {asignatura.grados.slice(0, 2).map((grado) => (
                <Badge key={grado} variant="secondary" className="text-xs">
                  {grado}
                </Badge>
              ))}
              {asignatura.grados.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{asignatura.grados.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
