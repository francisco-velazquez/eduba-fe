import { useState } from "react";
import { Plus, Search, MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlumnoDialog } from "@/components/dialogs/AlumnoDialog";

const alumnosData = [
  { id: 1, nombre: "María García", email: "maria.garcia@estudiante.edu", grado: "3° Primaria", matricula: "2024-001", estado: "activo" },
  { id: 2, nombre: "Juan Pérez", email: "juan.perez@estudiante.edu", grado: "3° Primaria", matricula: "2024-002", estado: "activo" },
  { id: 3, nombre: "Ana López", email: "ana.lopez@estudiante.edu", grado: "5° Primaria", matricula: "2024-003", estado: "activo" },
  { id: 4, nombre: "Pedro Sánchez", email: "pedro.sanchez@estudiante.edu", grado: "1° Secundaria", matricula: "2024-004", estado: "activo" },
  { id: 5, nombre: "Laura Ramírez", email: "laura.ramirez@estudiante.edu", grado: "2° Secundaria", matricula: "2024-005", estado: "inactivo" },
  { id: 6, nombre: "Diego Torres", email: "diego.torres@estudiante.edu", grado: "6° Primaria", matricula: "2024-006", estado: "activo" },
];

export default function Alumnos() {
  const [search, setSearch] = useState("");
  const [gradoFilter, setGradoFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAlumnos = alumnosData.filter((a) => {
    const matchesSearch =
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.matricula.toLowerCase().includes(search.toLowerCase());
    const matchesGrado = gradoFilter === "todos" || a.grado === gradoFilter;
    return matchesSearch && matchesGrado;
  });

  const grados = [...new Set(alumnosData.map((a) => a.grado))];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            Alumnos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los estudiantes registrados
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary border-0 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Alumno
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o matrícula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={gradoFilter} onValueChange={setGradoFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="Filtrar por grado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los grados</SelectItem>
            {grados.map((grado) => (
              <SelectItem key={grado} value={grado}>
                {grado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stat-card p-4">
          <p className="text-xs md:text-sm text-muted-foreground">Total</p>
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            {alumnosData.length}
          </p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs md:text-sm text-muted-foreground">Activos</p>
          <p className="text-xl md:text-2xl font-semibold text-success">
            {alumnosData.filter((a) => a.estado === "activo").length}
          </p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs md:text-sm text-muted-foreground">Inactivos</p>
          <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
            {alumnosData.filter((a) => a.estado === "inactivo").length}
          </p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs md:text-sm text-muted-foreground">Grados</p>
          <p className="text-xl md:text-2xl font-semibold text-primary">{grados.length}</p>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredAlumnos.map((alumno, index) => (
          <div
            key={alumno.id}
            className="bg-card rounded-xl border border-border shadow-card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-accent">
                    {alumno.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{alumno.nombre}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{alumno.email}</span>
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <code className="text-xs bg-muted px-2 py-1 rounded">{alumno.matricula}</code>
              <Badge variant="outline" className="font-normal text-xs">
                {alumno.grado}
              </Badge>
              <Badge
                variant={alumno.estado === "activo" ? "default" : "secondary"}
                className={
                  alumno.estado === "activo" ? "bg-success/10 text-success hover:bg-success/20" : ""
                }
              >
                {alumno.estado === "activo" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="table-header hover:bg-muted/50">
                <TableHead>Alumno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumnos.map((alumno, index) => (
                <TableRow
                  key={alumno.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">
                          {alumno.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{alumno.nombre}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {alumno.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{alumno.matricula}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {alumno.grado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={alumno.estado === "activo" ? "default" : "secondary"}
                      className={
                        alumno.estado === "activo"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : ""
                      }
                    >
                      {alumno.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlumnoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
