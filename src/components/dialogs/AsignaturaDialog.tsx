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

interface AsignaturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AsignaturaDialog({ open, onOpenChange }: AsignaturaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Asignatura</DialogTitle>
          <DialogDescription>
            Configure la nueva materia del plan de estudios.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Asignatura</Label>
            <Input id="nombre" placeholder="Ej: Matemáticas" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describa brevemente el contenido de la asignatura..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo">Código (Opcional)</Label>
            <Input id="codigo" placeholder="Ej: MAT-101" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="gradient-primary border-0">Guardar Asignatura</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
