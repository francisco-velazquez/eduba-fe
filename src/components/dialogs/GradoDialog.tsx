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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GradoDialog({ open, onOpenChange }: GradoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Grado</DialogTitle>
          <DialogDescription>
            Configure el nuevo grado académico para la institución.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Grado</Label>
            <Input id="nombre" placeholder="Ej: 4° Primaria" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nivel">Nivel Educativo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preescolar">Preescolar</SelectItem>
                <SelectItem value="primaria">Primaria</SelectItem>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="preparatoria">Preparatoria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Input id="descripcion" placeholder="Breve descripción del grado" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="gradient-primary border-0">Guardar Grado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
