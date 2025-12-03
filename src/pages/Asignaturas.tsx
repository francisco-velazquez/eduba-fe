import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AsignaturaDialog } from "@/components/dialogs/AsignaturaDialog";

const asignaturasData = [
  { id: 1, nombre: "Matemáticas", descripcion: "Álgebra, geometría y aritmética", grados: ["3° Primaria", "4° Primaria", "5° Primaria"], maestro: "Carlos López", color: "bg-blue-500" },
  { id: 2, nombre: "Español", descripcion: "Gramática, lectura y redacción", grados: ["1° Primaria", "2° Primaria", "3° Primaria"], maestro: "María Hernández", color: "bg-red-500" },
  { id: 3, nombre: "Historia", descripcion: "Historia de México y Universal", grados: ["5° Primaria", "6° Primaria", "1° Secundaria"], maestro: "Ana Martínez", color: "bg-amber-500" },
  { id: 4, nombre: "Física", descripcion: "Mecánica, termodinámica y ondas", grados: ["2° Secundaria", "3° Secundaria"], maestro: "Carlos López", color: "bg-purple-500" },
  { id: 5, nombre: "Química", descripcion: "Química general y orgánica", grados: ["2° Secundaria", "3° Secundaria"], maestro: "Roberto García", color: "bg-green-500" },
  { id: 6, nombre: "Inglés", descripcion: "Gramática y conversación", grados: ["1° Secundaria", "2° Secundaria", "3° Secundaria"], maestro: "José Rodríguez", color: "bg-cyan-500" },
  { id: 7, nombre: "Geografía", descripcion: "Geografía física y política", grados: ["4° Primaria", "5° Primaria", "6° Primaria"], maestro: "Ana Martínez", color: "bg-teal-500" },
  { id: 8, nombre: "Biología", descripcion: "Ciencias naturales y biología", grados: ["1° Secundaria", "2° Secundaria"], maestro: "Roberto García", color: "bg-emerald-500" },
];

export default function Asignaturas() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAsignaturas = asignaturasData.filter(
    (a) =>
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.maestro.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Asignaturas</h1>
          <p className="page-description">Gestiona las materias del plan de estudios</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Asignatura
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar asignaturas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAsignaturas.map((asignatura, index) => (
          <div
            key={asignatura.id}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden group animate-fade-in hover:shadow-elevated transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Color Header */}
            <div className={`h-2 ${asignatura.color}`} />
            
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{asignatura.nombre}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {asignatura.descripcion}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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

              {/* Teacher */}
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{asignatura.maestro}</span>
              </div>

              {/* Grades */}
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span>Grados asignados</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {asignatura.grados.map((grado) => (
                    <Badge key={grado} variant="secondary" className="text-xs">
                      {grado}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AsignaturaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
