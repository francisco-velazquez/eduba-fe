import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamByModule } from "@/hooks/useExams";
import { AppExam } from "@/services/api/exams.api";

interface ModuleExamButtonProps {
  moduleId: number;
  onTakeExam: (exam: AppExam) => void;
}

export function ModuleExamButton({ moduleId, onTakeExam }: ModuleExamButtonProps) {
  const { data: exam, isLoading } = useExamByModule(moduleId);

  if (isLoading || !exam) {
    return null;
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onTakeExam(exam);
      }}
      className="w-full flex items-center gap-3 p-3 text-left transition-colors bg-violet-500/10 hover:bg-violet-500/20 border-l-2 border-violet-500"
    >
      <FileQuestion className="h-4 w-4 text-violet-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-violet-600 font-medium truncate">
          {exam.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{exam.questionsCount} preguntas</span>
        </div>
      </div>
      <Button
        size="sm"
        className="bg-violet-600 hover:bg-violet-700 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onTakeExam(exam);
        }}
      >
        Tomar Examen
      </Button>
    </button>
  );
}
