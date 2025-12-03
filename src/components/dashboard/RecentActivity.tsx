import { UserPlus, BookOpen, GraduationCap, FileText } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "user",
    message: "Nuevo alumno registrado: María García",
    time: "Hace 5 minutos",
    icon: UserPlus,
  },
  {
    id: 2,
    type: "course",
    message: "Nuevo módulo creado en Matemáticas 3°",
    time: "Hace 1 hora",
    icon: BookOpen,
  },
  {
    id: 3,
    type: "grade",
    message: "Examen de Historia completado por 25 alumnos",
    time: "Hace 2 horas",
    icon: FileText,
  },
  {
    id: 4,
    type: "assignment",
    message: "Prof. López asignado a Física 2°",
    time: "Hace 3 horas",
    icon: GraduationCap,
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Actividad Reciente</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 px-6 py-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <activity.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
