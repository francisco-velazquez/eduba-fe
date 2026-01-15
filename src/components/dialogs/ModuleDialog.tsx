import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export type ModuleFormValues = z.infer<typeof formSchema>;

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ModuleFormValues) => void;
  isSubmitting: boolean;
  initialValues?: ModuleFormValues | null;
  mode?: "create" | "edit";
}

export function ModuleDialog({ open, onOpenChange, onSubmit, isSubmitting, initialValues, mode = "create" }: ModuleDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(initialValues || {
        title: "",
        description: "",
        isPublished: true,
      });
    }
  }, [open, initialValues, reset]);

  const handleFormSubmit: SubmitHandler<ModuleFormValues> = (values) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo Módulo" : "Editar Módulo"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Crea un nuevo módulo para organizar el contenido de tu asignatura." : "Modifica los detalles del módulo existente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del módulo</Label>
            <Input
              id="title"
              placeholder="Ej: Ecuaciones de primer grado"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Una breve descripción del módulo"
              {...register("description")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isPublished" {...register("isPublished")} defaultChecked={true} />
            <Label htmlFor="isPublished">{mode === "create" ? "Publicar módulo al crearlo" : "Módulo publicado"}</Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : (mode === "create" ? "Crear Módulo" : "Guardar Cambios")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}