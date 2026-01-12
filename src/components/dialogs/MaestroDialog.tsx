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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTeacher, useUpdateTeacher } from "@/hooks/useTeachers";
import type { AppTeacher } from "@/services/api/teachers.api";

interface MaestroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maestro?: AppTeacher | null;
}

export function MaestroDialog({ open, onOpenChange, maestro }: MaestroDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isActive, setIsActive] = useState("activo");

  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();

  const isEditing = !!maestro;
  const isLoading = createTeacher.isPending || updateTeacher.isPending;

  useEffect(() => {
    if (open && maestro) {
      setFirstName(maestro.firstName);
      setLastName(maestro.lastName);
      setEmail(maestro.email);
      setPhone(maestro.telefono);
      // Convert date from ISO 8601 to YYYY-MM-DD format for input type="date"
      const fechaNacimiento = maestro.fechaNacimiento 
        ? new Date(maestro.fechaNacimiento).toISOString().split('T')[0]
        : "";
      setDateOfBirth(fechaNacimiento);
      setIsActive(maestro.estado);
      setPassword("");
    } else if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setDateOfBirth("");
      setIsActive("activo");
    }
  }, [open, maestro]);

  const handleSubmit = async () => {
    try {
      if (isEditing && maestro) {
        await updateTeacher.mutateAsync({
          id: maestro.id,
          data: {
            firstName,
            lastName,
            email,
            phone: phone || undefined,
            dateOfBirth: dateOfBirth || undefined,
            isActive: isActive === "activo",
          },
        });
      } else {
        await createTeacher.mutateAsync({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
          password,
        });
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
          <DialogTitle>{isEditing ? "Editar Maestro" : "Nuevo Maestro"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del maestro."
              : "Ingrese los datos del nuevo docente."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="555-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={isActive} onValueChange={setIsActive}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            className="gradient-primary border-0"
            onClick={handleSubmit}
            disabled={!firstName || !lastName || !email || !dateOfBirth || (!isEditing && !password) || isLoading}
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Maestro" : "Guardar Maestro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
