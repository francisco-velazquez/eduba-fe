import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Users, BookOpen, GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const asignacionesGrado = [
  { grado: "3° Primaria", asignaturas: ["Matemáticas", "Español", "Historia", "Ciencias Naturales", "Educación Física"] },
  { grado: "5° Primaria", asignaturas: ["Matemáticas", "Español", "Historia", "Geografía", "Inglés", "Ciencias Naturales"] },
  { grado: "1° Secundaria", asignaturas: ["Matemáticas", "Español", "Historia", "Biología", "Inglés", "Física", "Química"] },
];

const asignacionesMaestro = [
  { maestro: "Carlos López", asignaturas: ["Matemáticas", "Física"] },
  { maestro: "Ana Martínez", asignaturas: ["Historia", "Geografía"] },
  { maestro: "Roberto García", asignaturas: ["Química", "Biología"] },
  { maestro: "José Rodríguez", asignaturas: ["Inglés"] },
];

const alumnosGrado = [
  { alumno: "María García", grado: "3° Primaria" },
  { alumno: "Juan Pérez", grado: "3° Primaria" },
  { alumno: "Ana López", grado: "5° Primaria" },
  { alumno: "Pedro Sánchez", grado: "1° Secundaria" },
];

export default function Asignaciones() {
  const [selectedGrado, setSelectedGrado] = useState("");
  const [selectedMaestro, setSelectedMaestro] = useState("");
  const [selectedAlumno, setSelectedAlumno] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-header">Asignaciones</h1>
        <p className="page-description">Gestiona las relaciones entre grados, asignaturas, maestros y alumnos</p>
      </div>

      <Tabs defaultValue="grado-asignatura" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="grado-asignatura" className="data-[state=active]:bg-card">
            Grado → Asignaturas
          </TabsTrigger>
          <TabsTrigger value="maestro-asignatura" className="data-[state=active]:bg-card">
            Maestro → Asignaturas
          </TabsTrigger>
          <TabsTrigger value="alumno-grado" className="data-[state=active]:bg-card">
            Alumno → Grado
          </TabsTrigger>
        </TabsList>

        {/* Grado -> Asignaturas */}
        <TabsContent value="grado-asignatura" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Asignar Asignaturas a Grado</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedGrado} onValueChange={setSelectedGrado}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-primaria">1° Primaria</SelectItem>
                  <SelectItem value="2-primaria">2° Primaria</SelectItem>
                  <SelectItem value="3-primaria">3° Primaria</SelectItem>
                  <SelectItem value="1-secundaria">1° Secundaria</SelectItem>
                </SelectContent>
              </Select>
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematicas">Matemáticas</SelectItem>
                  <SelectItem value="espanol">Español</SelectItem>
                  <SelectItem value="historia">Historia</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gradient-primary border-0">
                <Plus className="h-4 w-4 mr-2" />
                Asignar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {asignacionesGrado.map((item, index) => (
              <div
                key={item.grado}
                className="stat-card animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.grado}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.asignaturas.map((asig) => (
                    <Badge key={asig} variant="secondary">
                      {asig}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Maestro -> Asignaturas */}
        <TabsContent value="maestro-asignatura" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Asignar Asignaturas a Maestro</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedMaestro} onValueChange={setSelectedMaestro}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar maestro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carlos">Carlos López</SelectItem>
                  <SelectItem value="ana">Ana Martínez</SelectItem>
                  <SelectItem value="roberto">Roberto García</SelectItem>
                </SelectContent>
              </Select>
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar asignatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematicas">Matemáticas</SelectItem>
                  <SelectItem value="espanol">Español</SelectItem>
                  <SelectItem value="historia">Historia</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gradient-primary border-0">
                <Plus className="h-4 w-4 mr-2" />
                Asignar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {asignacionesMaestro.map((item, index) => (
              <div
                key={item.maestro}
                className="stat-card animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {item.maestro.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground">{item.maestro}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.asignaturas.map((asig) => (
                    <Badge key={asig} variant="outline">
                      {asig}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Alumno -> Grado */}
        <TabsContent value="alumno-grado" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Asignar Grado a Alumno</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedAlumno} onValueChange={setSelectedAlumno}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar alumno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria">María García</SelectItem>
                  <SelectItem value="juan">Juan Pérez</SelectItem>
                  <SelectItem value="ana">Ana López</SelectItem>
                </SelectContent>
              </Select>
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-primaria">3° Primaria</SelectItem>
                  <SelectItem value="4-primaria">4° Primaria</SelectItem>
                  <SelectItem value="5-primaria">5° Primaria</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gradient-primary border-0">
                <Plus className="h-4 w-4 mr-2" />
                Asignar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Nota:</strong> Un alumno solo puede tener un grado activo a la vez.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Asignaciones Actuales</h3>
            </div>
            <div className="divide-y divide-border">
              {alumnosGrado.map((item, index) => (
                <div
                  key={item.alumno}
                  className="flex items-center justify-between px-6 py-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{item.alumno}</span>
                  </div>
                  <Badge variant="secondary">{item.grado}</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
