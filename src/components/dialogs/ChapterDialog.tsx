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
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  videoFile: z.instanceof(File).optional().nullable(),
  contentFile: z.instanceof(File).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export type ChapterFormValues = z.infer<typeof formSchema>;

interface ChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ChapterFormValues) => void;
  isSubmitting: boolean;
  mode?: "create" | "edit";
}

export function ChapterDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting,
  mode = "create" 
}: ChapterDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublished: true,
      videoFile: null,
      contentFile: null,
    },
  });

  const videoFile = watch("videoFile");
  const contentFile = watch("contentFile");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit: SubmitHandler<ChapterFormValues> = (values) => {
    onSubmit(values);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "videoFile" | "contentFile") => {
    const file = e.target.files?.[0] || null;
    setValue(field, file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo Capítulo" : "Editar Capítulo"}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Agrega un nuevo capítulo para organizar el contenido dentro del módulo."
              : "Modifica los detalles del capítulo existente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del capítulo</Label>
            <Input
              id="title"
              placeholder="Ej: Introducción a las variables"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Video del capítulo (Opcional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors relative text-center">
              <input 
                type="file" 
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, "videoFile")}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                {videoFile ? (
                  <div className="flex items-center gap-2 z-20">
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{videoFile.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("videoFile", null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-emerald-600">Haz clic para subir</span> o arrastra un video
                    <p className="text-xs mt-1">MP4, WebM</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Material extra (Opcional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors relative text-center">
              <input 
                type="file" 
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => handleFileChange(e, "contentFile")}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                {contentFile ? (
                  <div className="flex items-center gap-2 z-20">
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{contentFile.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("contentFile", null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-emerald-600">Haz clic para subir</span> o arrastra un archivo
                    <p className="text-xs mt-1">PDF, PPT, Word</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isPublished" {...register("isPublished")} defaultChecked={true} />
            <Label htmlFor="isPublished" className="cursor-pointer">Publicar capítulo al crearlo</Label>
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
              {isSubmitting ? "Guardando..." : (mode === "create" ? "Crear Capítulo" : "Guardar Cambios")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
