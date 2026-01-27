import { useState, useEffect } from "react";
import { ClipboardList, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useExamByModule } from "@/hooks/useExams";
import { AppModule } from "@/services/api/modules.api";
import { AppExam } from "@/services/api/exams.api";

interface ModuleExamMenuProps {
  module: AppModule;
  onCreateExam: (module: AppModule) => void;
  onEditExam: (module: AppModule, exam: AppExam) => void;
  onDeleteExam: (examId: number) => void;
}

export function ModuleExamMenu({
  module,
  onCreateExam,
  onEditExam,
  onDeleteExam,
}: ModuleExamMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: exam, isLoading, refetch } = useExamByModule(isOpen ? module.id : undefined);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <DropdownMenuSub onOpenChange={setIsOpen}>
      <DropdownMenuSubTrigger>
        <ClipboardList className="h-4 w-4 mr-2" />
        Gestionar Examen
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : exam ? (
          <>
            <DropdownMenuItem onClick={() => onEditExam(module, exam)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Examen
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDeleteExam(exam.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Examen
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => onCreateExam(module)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Examen
          </DropdownMenuItem>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
