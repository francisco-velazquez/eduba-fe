import { useState } from "react";
import { Plus, Search, MoreHorizontal, Mail, Phone, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MaestroDialog } from "@/components/dialogs/MaestroDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { PageHeader, LoadingSpinner, EmptyState } from "@/components/common";
import { useTeachers, useDeleteTeacher } from "@/hooks/useTeachers";
import type { AppTeacher } from "@/services/api/teachers.api";

export default function Maestros() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaestro, setSelectedMaestro] = useState<AppTeacher | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [maestroToDelete, setMaestroToDelete] = useState<AppTeacher | null>(null);

  const { data: maestros = [], isLoading, error } = useTeachers();
  const deleteTeacher = useDeleteTeacher();

  const filteredMaestros = maestros.filter(
    (m) =>
      m.nombre.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (maestro: AppTeacher) => {
    setSelectedMaestro(maestro);
    setDialogOpen(true);
  };

  const handleDelete = (maestro: AppTeacher) => {
    setMaestroToDelete(maestro);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (maestroToDelete) {
      await deleteTeacher.mutateAsync(maestroToDelete.id);
      setDeleteDialogOpen(false);
      setMaestroToDelete(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedMaestro(null);
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
        icon={Users}
        title="Error al cargar maestros"
        description={error.message}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Maestros"
        description="Gestiona el personal docente"
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="gradient-primary border-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Maestro
          </Button>
        }
      />

      {/* Filters */}
      <div className="relative max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar maestros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {maestros.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay maestros"
          description="Agrega tu primer maestro para comenzar"
        />
      ) : filteredMaestros.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Sin resultados"
          description="No se encontraron maestros con ese criterio de búsqueda"
        />
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredMaestros.map((maestro, index) => (
              <div
                key={maestro.id}
                className="bg-card rounded-xl border border-border shadow-card p-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {maestro.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{maestro.nombre}</p>
                      <Badge
                        variant={maestro.estado === "activo" ? "default" : "secondary"}
                        className={
                          maestro.estado === "activo"
                            ? "bg-success/10 text-success hover:bg-success/20 mt-1"
                            : "mt-1"
                        }
                      >
                        {maestro.estado === "activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(maestro)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(maestro)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{maestro.email}</span>
                  </p>
                  {maestro.telefono && (
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {maestro.telefono}
                    </p>
                  )}
                </div>

                {maestro.asignaturas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {maestro.asignaturas.map((asig) => (
                      <Badge key={asig} variant="secondary" className="text-xs">
                        {asig}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header hover:bg-muted/50">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Asignaturas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaestros.map((maestro, index) => (
                    <TableRow
                      key={maestro.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {maestro.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{maestro.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {maestro.email}
                          </div>
                          {maestro.telefono && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {maestro.telefono}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {maestro.asignaturas.length > 0 ? (
                            maestro.asignaturas.map((asig) => (
                              <Badge key={asig} variant="secondary" className="text-xs">
                                {asig}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Sin asignar</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={maestro.estado === "activo" ? "default" : "secondary"}
                          className={
                            maestro.estado === "activo"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : ""
                          }
                        >
                          {maestro.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(maestro)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(maestro)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      <MaestroDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        maestro={selectedMaestro}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Maestro"
        description={`¿Estás seguro de eliminar a "${maestroToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        isLoading={deleteTeacher.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
