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
import { useCreateSubject, useUpdateSubject } from "@/hooks/useSubjects";
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
  
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const { data: grados = [] } = useGrades();
  
  const isEditing = !!asignatura;
  const isLoading = createSubject.isPending || updateSubject.isPending;

  useEffect(() => {
    if (open && asignatura) {
      setNombre(asignatura.nombre);
      setDescripcion(asignatura.descripcion);
      setCodigo(asignatura.codigo ?? "");
      // Find grade ID from grades list
      const matchingGrade = grados.find(g => asignatura.grados.includes(g.nombre));
      setGradoId(matchingGrade?.id ?? "");
    } else if (!open) {
      // Reset form when closing
      setNombre("");
      setDescripcion("");
      setCodigo("");
      setGradoId("");
    }
  }, [open, asignatura, grados]);

  const handleSubmit = async () => {
    const data = {
      name: nombre,
      description: descripcion || undefined,
      code: codigo || undefined,
      gradeId: gradoId || undefined,
    };

    try {
      if (isEditing && asignatura) {
        await updateSubject.mutateAsync({ id: String(asignatura.id), data });
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
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Asignatura</Label>
            <Input 
              id="nombre" 
              placeholder="Ej: Matemáticas"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grado">Grado</Label>
            <Select value={gradoId} onValueChange={setGradoId}>
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
            />
          </div>
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
