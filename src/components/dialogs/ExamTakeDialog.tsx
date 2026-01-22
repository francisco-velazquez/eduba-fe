import { useState } from "react";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AppExam, ExamResultResponse } from "@/services/api/exams.api";
import { useSubmitExam } from "@/hooks/useExams";

interface ExamTakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: AppExam | null;
}

export function ExamTakeDialog({ open, onOpenChange, exam }: ExamTakeDialogProps) {
  const submitExam = useSubmitExam();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ExamResultResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setCurrentQuestion(0);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    const answersArray = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId: parseInt(questionId),
      optionId,
    }));

    const response = await submitExam.mutateAsync({
      examId: exam.id,
      data: { answers: answersArray },
    });

    setResult(response);
  };

  const allQuestionsAnswered = exam
    ? Object.keys(answers).length === exam.questions.length
    : false;

  const progress = exam
    ? (Object.keys(answers).length / exam.questions.length) * 100
    : 0;

  if (!exam) return null;

  // Show result screen
  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div
              className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4 ${
                result.passed ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}
            >
              {result.passed ? (
                <Trophy className="h-10 w-10 text-emerald-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {result.passed ? "¡Felicidades!" : "Examen completado"}
            </h2>

            <p className="text-muted-foreground mb-6">
              {result.passed
                ? "Has aprobado el examen"
                : "No has alcanzado el puntaje mínimo"}
            </p>

            <div className="bg-muted/30 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-foreground mb-2">
                {result.score}%
              </div>
              <p className="text-muted-foreground">
                {result.correctAnswers} de {result.totalQuestions} respuestas correctas
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{exam.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              Pregunta {currentQuestion + 1} de {exam.questions.length}
            </span>
          </DialogTitle>
          <Progress value={progress} className="h-2" />
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="py-6">
            <h3 className="text-lg font-medium text-foreground mb-6">
              {question.text}
            </h3>

            <RadioGroup
              value={answers[question.id]?.toString() ?? ""}
              onValueChange={(value) =>
                handleSelectOption(question.id, parseInt(value))
              }
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    answers[question.id] === option.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-border hover:bg-muted/30"
                  }`}
                  onClick={() => handleSelectOption(question.id, option.id)}
                >
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`option-${option.id}`}
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex-1 cursor-pointer text-foreground"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(exam.questions.length - 1, prev + 1)
                )
              }
              disabled={currentQuestion === exam.questions.length - 1}
            >
              Siguiente
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || submitExam.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {submitExam.isPending ? "Enviando..." : "Enviar Respuestas"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
