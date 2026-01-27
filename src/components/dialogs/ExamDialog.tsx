import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateExamQuestionDto, CreateExamOptionDto, AppExam } from "@/services/api/exams.api";

interface QuestionFormData {
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: CreateExamOptionDto[];
}

export interface ExamFormValues {
  title: string;
  questions: CreateExamQuestionDto[];
}

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ExamFormValues) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  initialData?: AppExam | null;
  moduleName?: string;
}

const defaultOption: CreateExamOptionDto = { optionText: "", isCorrect: false };

const defaultQuestion: QuestionFormData = {
  questionText: "",
  questionType: "multiple_choice",
  options: [
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ],
};

const trueFalseOptions: CreateExamOptionDto[] = [
  { optionText: "Verdadero", isCorrect: false },
  { optionText: "Falso", isCorrect: false },
];

export function ExamDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  initialData,
  moduleName,
}: ExamDialogProps) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionFormData[]>([{ ...defaultQuestion }]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title);
        setQuestions(
          initialData.questions.map((q) => ({
            questionText: q.text,
            questionType: q.type,
            options: q.options.map((o) => ({
              optionText: o.text,
              isCorrect: o.isCorrect ?? false,
            })),
          }))
        );
      } else {
        setTitle("");
        setQuestions([{ ...defaultQuestion }]);
      }
    }
  }, [open, mode, initialData]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index: number, field: keyof QuestionFormData, value: string) => {
    const updated = [...questions];
    if (field === "questionType") {
      const newType = value as "multiple_choice" | "true_false";
      updated[index] = {
        ...updated[index],
        questionType: newType,
        options: newType === "true_false" 
          ? [...trueFalseOptions] 
          : [
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
              { optionText: "", isCorrect: false },
            ],
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = {
      ...updated[qIndex].options[oIndex],
      optionText: value,
    };
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    // Only one correct answer per question
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex,
    }));
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length < 6) {
      updated[qIndex].options.push({ ...defaultOption });
      setQuestions(updated);
    }
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
      setQuestions(updated);
    }
  };

  const handleSubmit = () => {
    // Validate
    if (!title.trim()) return;
    if (questions.some((q) => !q.questionText.trim())) return;
    if (questions.some((q) => q.options.some((o) => !o.optionText.trim()))) return;
    if (questions.some((q) => !q.options.some((o) => o.isCorrect))) return;

    onSubmit({
      title: title.trim(),
      questions: questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
      })),
    });
  };

  const isValid = () => {
    if (!title.trim()) return false;
    if (questions.length === 0) return false;
    if (questions.some((q) => !q.questionText.trim())) return false;
    if (questions.some((q) => q.options.some((o) => !o.optionText.trim()))) return false;
    if (questions.some((q) => !q.options.some((o) => o.isCorrect))) return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0 pb-2">
          <DialogTitle className="text-base sm:text-lg">
            {mode === "create" ? "Crear Examen" : "Editar Examen"}
            {moduleName && (
              <span className="text-muted-foreground font-normal text-xs sm:text-sm block sm:inline sm:ml-2 mt-1 sm:mt-0">
                — {moduleName}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {mode === "create" ? "crear un nuevo" : "editar el"} examen
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="exam-title">Título del Examen</Label>
              <Input
                id="exam-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Examen Final - Módulo 1"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Preguntas ({questions.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Pregunta
                </Button>
              </div>

              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-muted/30 rounded-lg p-4 space-y-4 border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Pregunta {qIndex + 1}
                        </span>
                        <Select
                          value={question.questionType}
                          onValueChange={(value) =>
                            handleQuestionChange(qIndex, "questionType", value)
                          }
                        >
                          <SelectTrigger className="w-44 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">
                              Opción Múltiple
                            </SelectItem>
                            <SelectItem value="true_false">
                              Verdadero/Falso
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "questionText", e.target.value)
                        }
                        placeholder="Escribe la pregunta aquí..."
                        className="min-h-[60px]"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      disabled={questions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 ml-6">
                    <Label className="text-xs text-muted-foreground">
                      Opciones (marca la correcta)
                    </Label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <Switch
                          checked={option.isCorrect}
                          onCheckedChange={() => handleCorrectChange(qIndex, oIndex)}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <Input
                          value={option.optionText}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Opción ${oIndex + 1}`}
                          className="flex-1"
                          disabled={question.questionType === "true_false"}
                        />
                        {question.questionType === "multiple_choice" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveOption(qIndex, oIndex)}
                            disabled={question.options.length <= 2}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {question.questionType === "multiple_choice" &&
                      question.options.length < 6 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddOption(qIndex)}
                          className="text-muted-foreground"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar opción
                        </Button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t pt-3 sm:pt-4 flex-shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid() || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none"
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "create"
              ? "Crear Examen"
              : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
