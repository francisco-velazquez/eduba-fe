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
import { useCreateGrade, useUpdateGrade, useGrade } from "@/hooks/useGrades";
import type { AppGrade } from "@/services/api/grades.api";

const NIVELES_EDUCATIVOS = [
  { value: "Preescolar", label: "Preescolar" },
  { value: "Primaria", label: "Primaria" },
  { value: "Secundaria", label: "Secundaria" },
  { value: "Preparatoria", label: "Preparatoria" },
];

interface GradoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado?: AppGrade | null;
}

export function GradoDialog({ open, onOpenChange, grado }: GradoDialogProps) {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();

  // Fetch grade data when dialog opens in edit mode
  const isEditing = !!grado;
  const gradoId = grado?.id ? String(grado.id) : "";
  const { data: fetchedGrado, isLoading: isLoadingGrade } = useGrade(gradoId);

  // When editing, prioritize fetched data from API
  const gradeData = isEditing && open
    ? (fetchedGrado || (isLoadingGrade ? null : grado))
    : null;
  const isLoading = createGrade.isPending || updateGrade.isPending || (isEditing && isLoadingGrade);

  useEffect(() => {
    if (open) {
      if (gradeData) {
        // Populate form with grade data
        setNombre(gradeData.nombre);
        setNivel(gradeData.nivel ?? "");
        setDescripcion(gradeData.descripcion ?? "");
      } else if (!isEditing) {
        // Reset form when opening for creation
        setNombre("");
        setNivel("");
        setDescripcion("");
      }
    } else {
      // Reset form when closing
      setNombre("");
      setNivel("");
      setDescripcion("");
    }
  }, [open, gradeData, isEditing]);

  const handleSubmit = async () => {
    const data = {
      name: nombre,
      level: nivel,
      description: descripcion || undefined,
    };

    try {
      if (isEditing && gradeData) {
        await updateGrade.mutateAsync({ id: String(gradeData.id), data });
      } else {
        await createGrade.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Grado" : "Agregar Nuevo Grado"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del grado académico."
              : "Configure el nuevo grado académico para la institución."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEditing && isLoadingGrade ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Cargando información del grado...</div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Grado</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: 4° Primaria"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isLoadingGrade}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel Educativo</Label>
                <Select value={nivel} onValueChange={setNivel} disabled={isLoadingGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES_EDUCATIVOS.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Breve descripción del grado"
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={isLoadingGrade}
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
            disabled={!nombre || !nivel || isLoading}
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Grado" : "Guardar Grado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
