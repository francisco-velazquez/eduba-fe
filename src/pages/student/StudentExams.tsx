import { FileQuestion, Clock, CheckCircle, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const pendingExams = [
  {
    id: 1,
    name: "Quiz - Ecuaciones cuadráticas",
    subject: "Matemáticas",
    questions: 10,
    duration: 20,
    deadline: "Mañana, 10:00 AM",
    urgent: true,
  },
  {
    id: 2,
    name: "Examen Parcial - Análisis Literario",
    subject: "Español",
    questions: 25,
    duration: 45,
    deadline: "Vie 25 Ene, 2:00 PM",
    urgent: false,
  },
];

const completedExams = [
  {
    id: 3,
    name: "Quiz - Factorización",
    subject: "Matemáticas",
    score: 9.5,
    maxScore: 10,
    date: "15 Ene 2024",
    questions: 10,
  },
  {
    id: 4,
    name: "Examen - Verbos en pasado",
    subject: "Inglés",
    score: 8.0,
    maxScore: 10,
    date: "10 Ene 2024",
    questions: 20,
  },
  {
    id: 5,
    name: "Quiz - Sistema Solar",
    subject: "Ciencias",
    score: 10,
    maxScore: 10,
    date: "5 Ene 2024",
    questions: 15,
  },
];

export default function StudentExams() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-header">Mis Exámenes</h1>
        <p className="page-description">
          Revisa tus evaluaciones pendientes y resultados
        </p>
      </div>

      {/* Pending Exams */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Exámenes Pendientes
        </h2>
        
        {pendingExams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingExams.map((exam) => (
              <div
                key={exam.id}
                className={`bg-card rounded-xl border shadow-card p-6 ${
                  exam.urgent ? "border-amber-500/50" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{exam.name}</h3>
                    <p className="text-sm text-muted-foreground">{exam.subject}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <FileQuestion className="h-5 w-5 text-violet-600" />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    {exam.questions} preguntas
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {exam.duration} min
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha límite:</p>
                    <p className={`text-sm font-medium ${exam.urgent ? "text-amber-600" : "text-foreground"}`}>
                      {exam.deadline}
                    </p>
                  </div>
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-foreground font-medium">¡No tienes exámenes pendientes!</p>
            <p className="text-sm text-muted-foreground">Sigue así con tu buen trabajo</p>
          </div>
        )}
      </div>

      {/* Completed Exams */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          Exámenes Completados
        </h2>
        
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Examen</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Asignatura</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Preguntas</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Calificación</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {completedExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{exam.name}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{exam.subject}</td>
                  <td className="p-4 text-center text-muted-foreground">{exam.questions}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${
                      exam.score >= 9 ? "bg-emerald-500/20 text-emerald-600" :
                      exam.score >= 7 ? "bg-amber-500/20 text-amber-600" :
                      "bg-red-500/20 text-red-600"
                    }`}>
                      {exam.score}/{exam.maxScore}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{exam.date}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
