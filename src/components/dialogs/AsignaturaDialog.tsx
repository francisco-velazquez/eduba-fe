import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateSubject, useUpdateSubject, useSubject } from "@/hooks/useSubjects";
import { useGrades } from "@/hooks/useGrades";
import type { AppSubject } from "@/services/api/subjects.api";

interface AsignaturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asignatura?: AppSubject | null;
}

export function AsignaturaDialog({ open, onOpenChange, asignatura }: AsignaturaDialogProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [gradoId, setGradoId] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const { data: grados = [] } = useGrades();
  
  // Fetch subject data when dialog opens in edit mode
  const isEditing = !!asignatura;
  const asignaturaId = asignatura?.id ? String(asignatura.id) : "";
  const { data: fetchedAsignatura, isLoading: isLoadingSubject } = useSubject(
    asignaturaId,
    open && !!asignaturaId // Only fetch when dialog is open and we have an ID
  );
  
  // When editing, prioritize fetched data from API. Only use prop data if fetch hasn't completed yet
  // When creating, subjectData will be null
  const subjectData = isEditing && open 
    ? (fetchedAsignatura || (isLoadingSubject ? null : asignatura))
    : null;
  const isLoading = createSubject.isPending || updateSubject.isPending || (isEditing && isLoadingSubject);

  useEffect(() => {
    if (open) {
      if (subjectData) {
        // Populate form with subject data (fetched or from prop)
        setNombre(subjectData.nombre);
        setDescripcion(subjectData.descripcion);
        setCodigo(subjectData.codigo ?? "");
        setIsActive(subjectData.isActive ?? true);
        // Use gradeId directly from the mapped subject data
        // If gradeId is not available, try to find it by name as fallback
        if (subjectData.gradeId) {
          setGradoId(String(subjectData.gradeId));
        } else if (subjectData.grados && subjectData.grados.length > 0) {
          // Fallback: find grade ID by name
          const matchingGrade = grados.find(g => 
            subjectData.grados.includes(g.nombre)
          );
          setGradoId(matchingGrade?.id ?? "");
        } else {
          setGradoId("");
        }
      } else if (!isEditing) {
        // Reset form when opening for creation (new subject)
        setNombre("");
        setDescripcion("");
        setCodigo("");
        setGradoId("");
        setIsActive(true);
      }
    } else {
      // Reset form when closing
      setNombre("");
      setDescripcion("");
      setCodigo("");
      setGradoId("");
      setIsActive(true);
    }
  }, [open, subjectData, grados, isEditing]);

  const handleSubmit = async () => {
    const data = {
      name: nombre,
      description: descripcion || undefined,
      code: codigo || undefined,
      gradeId: Number(gradoId) || 0,
      isActive: isActive,
    };

    try {
      if (isEditing && subjectData) {
        await updateSubject.mutateAsync({ id: String(subjectData.id), data });
      } else {
        await createSubject.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Asignatura" : "Nueva Asignatura"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos de la asignatura."
              : "Configure la nueva materia del plan de estudios."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEditing && isLoadingSubject ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Cargando información de la asignatura...</div>
            </div>
          ) : (
            <>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Asignatura</Label>
            <Input 
              id="nombre" 
              placeholder="Ej: Matemáticas"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isLoadingSubject}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describa brevemente el contenido de la asignatura..."
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoadingSubject}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grado">Grado</Label>
            <Select value={gradoId} onValueChange={setGradoId} disabled={isLoadingSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {grados.map((grado) => (
                  <SelectItem key={grado.id} value={String(grado.id)}>
                    {grado.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo">Código (Opcional)</Label>
            <Input 
              id="codigo" 
              placeholder="Ej: MAT-101"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              disabled={isLoadingSubject}
            />
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Estado
              </Label>
              <div className="text-sm text-muted-foreground">
                {isActive ? "La asignatura está activa" : "La asignatura está inactiva"}
              </div>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isLoadingSubject}
            />
          </div>
          </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            className="gradient-primary border-0" 
            onClick={handleSubmit}
            disabled={!nombre || isLoading}
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Asignatura" : "Guardar Asignatura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
