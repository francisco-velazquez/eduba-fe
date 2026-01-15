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
import { Upload, X, FileText, Video } from "lucide-react";
import { useEffect, useState } from "react";

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
  initialData?: {
    title: string;
    isPublished: boolean;
    videoUrl?: string | null;
    contentUrl?: string | null;
  } | null;
}

export function ChapterDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting,
  mode = "create",
  initialData
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (initialData?.videoUrl) {
      setPreviewUrl(initialData.videoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [videoFile, initialData]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        reset({
          title: initialData.title,
          isPublished: initialData.isPublished,
          videoFile: null,
          contentFile: null,
        });
      } else {
        reset({
          title: "",
          isPublished: true,
          videoFile: null,
          contentFile: null,
        });
      }
    }
  }, [open, mode, initialData, reset]);

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
            {previewUrl ? (
              <div className="relative rounded-lg border border-border overflow-hidden bg-black/5">
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full max-h-[300px] aspect-video object-contain bg-black" 
                />
                <div className="absolute top-2 right-2 flex gap-2">
                   <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={(e) => handleFileChange(e, "videoFile")}
                      />
                      <Button type="button" variant="secondary" size="sm" className="h-8 shadow-sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Reemplazar
                      </Button>
                   </div>
                   {videoFile && (
                     <Button 
                       type="button" 
                       variant="destructive" 
                       size="icon" 
                       className="h-8 w-8 shadow-sm"
                       onClick={() => setValue("videoFile", null)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   )}
                </div>
                {videoFile && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-3 py-1.5 rounded text-xs truncate backdrop-blur-sm">
                        Archivo seleccionado: {videoFile.name}
                    </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 hover:bg-muted/50 transition-colors relative text-center group">
                <input 
                  type="file" 
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => handleFileChange(e, "videoFile")}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                    <Video className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-emerald-600">Haz clic para subir</span> o arrastra un video
                    <p className="text-xs mt-1 text-muted-foreground/70">MP4, WebM</p>
                  </div>
                </div>
              </div>
            )}
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
                ) : initialData?.contentUrl ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <FileText className="h-4 w-4" />
                    <span>Material actual cargado</span>
                    <span className="text-xs text-muted-foreground">(Sube uno nuevo para reemplazarlo)</span>
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
