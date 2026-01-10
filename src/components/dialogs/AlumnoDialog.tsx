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
import { useCreateStudent, useUpdateStudent } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import type { AppStudent } from "@/services/api/students.api";

interface AlumnoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumno?: AppStudent | null;
}

export function AlumnoDialog({ open, onOpenChange, alumno }: AlumnoDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gradoId, setGradoId] = useState("");
  const [isActive, setIsActive] = useState("activo");

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const { data: grados = [] } = useGrades();

  const isEditing = !!alumno;
  const isLoading = createStudent.isPending || updateStudent.isPending;

  useEffect(() => {
    if (open && alumno) {
      setFirstName(alumno.firstName);
      setLastName(alumno.lastName);
      setEmail(alumno.email);
      setEnrollmentCode(alumno.matricula ?? "");
      // Convert date from ISO 8601 to YYYY-MM-DD format for input type="date"
      const fechaNacimiento = alumno.fechaNacimiento 
        ? new Date(alumno.fechaNacimiento).toISOString().split('T')[0]
        : "";
      setDateOfBirth(fechaNacimiento);
      setGradoId(alumno.gradoId ?? "");
      setIsActive(alumno.estado);
      setPassword("");
    } else if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setEnrollmentCode("");
      setDateOfBirth("");
      setGradoId("");
      setIsActive("activo");
    }
  }, [open, alumno, grados]);

  const handleSubmit = async () => {
    try {
      if (isEditing && alumno) {
        await updateStudent.mutateAsync({
          id: alumno.id,
          data: {
            firstName,
            lastName,
            email,
            enrollmentCode: enrollmentCode || undefined,
            dateOfBirth: dateOfBirth || undefined,
            password: password || undefined,
            gradeId: gradoId || undefined,
            isActive: isActive === "activo",
          },
        });
      } else {
        await createStudent.mutateAsync({
          firstName,
          lastName,
          email,
          password,
          enrollmentCode: enrollmentCode || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gradeId: gradoId || undefined,
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
          <DialogTitle>{isEditing ? "Editar Alumno" : "Nuevo Alumno"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del alumno."
              : "Ingrese los datos del nuevo estudiante."
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
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              placeholder="Número de matrícula"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value)}
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
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditing ? "Dejar vacío para mantener la actual" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grado">Grado Académico</Label>
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
            disabled={!firstName || !lastName || !email || (!isEditing && !password) || isLoading}
          >
            {isLoading ? "Guardando..." : isEditing ? "Actualizar Alumno" : "Guardar Alumno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
