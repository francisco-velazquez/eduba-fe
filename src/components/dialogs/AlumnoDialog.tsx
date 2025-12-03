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

interface AlumnoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlumnoDialog({ open, onOpenChange }: AlumnoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Alumno</DialogTitle>
          <DialogDescription>
            Complete los datos del nuevo estudiante. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" placeholder="María" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" placeholder="García" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="alumno@escuela.edu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grado">Grado Académico</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-primaria">1° Primaria</SelectItem>
                <SelectItem value="2-primaria">2° Primaria</SelectItem>
                <SelectItem value="3-primaria">3° Primaria</SelectItem>
                <SelectItem value="4-primaria">4° Primaria</SelectItem>
                <SelectItem value="5-primaria">5° Primaria</SelectItem>
                <SelectItem value="6-primaria">6° Primaria</SelectItem>
                <SelectItem value="1-secundaria">1° Secundaria</SelectItem>
                <SelectItem value="2-secundaria">2° Secundaria</SelectItem>
                <SelectItem value="3-secundaria">3° Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select defaultValue="activo">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="gradient-primary border-0">Guardar Alumno</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
