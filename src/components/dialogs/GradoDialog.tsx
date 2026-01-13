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
import {Switch} from "@/components/ui/switch.tsx";

interface GradoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado?: AppGrade | null;
}

export function GradoDialog({ open, onOpenChange, grado }: GradoDialogProps) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);

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
        setName(gradeData.name);
        setLevel(gradeData.level ?? "");
        setCode(gradeData.code ?? "");
        setIsActive(gradeData.isActive ?? true);
      } else if (!isEditing) {
        // Reset form when opening for creation
        setName("");
        setLevel("");
        setCode("");
        setIsActive(true);
      }
    } else {
      // Reset form when closing
      setName("");
      setLevel("");
      setCode("");
      setIsActive(true);
    }
  }, [open, gradeData, isEditing]);

  const handleSubmit = async () => {
    const data = {
      name,
      level,
      code,
      isActive,
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
                <Label htmlFor="name">Nombre del Grado</Label>
                <Input
                  id="name"
                  placeholder="Ej: 4° Primaria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoadingGrade}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nivel Educativo</Label>
                  <Input
                      id="level"
                      placeholder="Ej: 4° Primaria"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={isLoadingGrade}
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Código de Grado</Label>
                <Input
                  id="code"
                  placeholder="Breve descripción del grado"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoadingGrade}
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
            disabled={!name || !level || isLoading}
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Grado" : "Guardar Grado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
