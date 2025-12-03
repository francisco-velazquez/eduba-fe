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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Maestros</h1>
          <p className="page-description">Gestiona el personal docente de la institución</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Maestro
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar maestros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
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
                        {maestro.nombre.split(" ").map(n => n[0]).join("")}
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
                    className={maestro.estado === "activo" ? "bg-success/10 text-success hover:bg-success/20" : ""}
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

      <MaestroDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
