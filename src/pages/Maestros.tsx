import { useState } from "react";
import { Plus, Search, MoreHorizontal, Mail, Phone, Edit, Trash2 } from "lucide-react";
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
import { MaestroDialog } from "@/components/dialogs/MaestroDialog";

const maestrosData = [
  { id: 1, nombre: "Carlos López", email: "carlos.lopez@edu.com", telefono: "555-1234", asignaturas: ["Matemáticas", "Física"], estado: "activo" },
  { id: 2, nombre: "Ana Martínez", email: "ana.martinez@edu.com", telefono: "555-5678", asignaturas: ["Historia", "Geografía"], estado: "activo" },
  { id: 3, nombre: "Roberto García", email: "roberto.garcia@edu.com", telefono: "555-9012", asignaturas: ["Química"], estado: "activo" },
  { id: 4, nombre: "María Hernández", email: "maria.hernandez@edu.com", telefono: "555-3456", asignaturas: ["Español", "Literatura"], estado: "inactivo" },
  { id: 5, nombre: "José Rodríguez", email: "jose.rodriguez@edu.com", telefono: "555-7890", asignaturas: ["Inglés"], estado: "activo" },
];

export default function Maestros() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredMaestros = maestrosData.filter(
    (m) =>
      m.nombre.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            Maestros
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona el personal docente
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary border-0 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Maestro
        </Button>
      </div>

      {/* Filters */}
      <div className="relative max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar maestros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredMaestros.map((maestro, index) => (
          <div
            key={maestro.id}
            className="bg-card rounded-xl border border-border shadow-card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {maestro.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{maestro.nombre}</p>
                  <Badge
                    variant={maestro.estado === "activo" ? "default" : "secondary"}
                    className={
                      maestro.estado === "activo"
                        ? "bg-success/10 text-success hover:bg-success/20 mt-1"
                        : "mt-1"
                    }
                  >
                    {maestro.estado === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
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

            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="truncate">{maestro.email}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {maestro.telefono}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {maestro.asignaturas.map((asig) => (
                <Badge key={asig} variant="secondary" className="text-xs">
                  {asig}
                </Badge>
              ))}
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
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Asignaturas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaestros.map((maestro, index) => (
                <TableRow
                  key={maestro.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {maestro.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{maestro.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {maestro.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {maestro.telefono}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {maestro.asignaturas.map((asig) => (
                        <Badge key={asig} variant="secondary" className="text-xs">
                          {asig}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={maestro.estado === "activo" ? "default" : "secondary"}
                      className={
                        maestro.estado === "activo"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : ""
                      }
                    >
                      {maestro.estado === "activo" ? "Activo" : "Inactivo"}
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

      <MaestroDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
