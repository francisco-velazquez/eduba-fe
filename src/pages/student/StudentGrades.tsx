import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageHeader } from "@/components/common";

const subjects = [
  {
    name: "Matemáticas",
    teacher: "Prof. García",
    currentGrade: 9.2,
    previousGrade: 8.8,
    assignments: [
      { name: "Examen Parcial 1", grade: 9.5, weight: 30 },
      { name: "Tareas", grade: 9.0, weight: 20 },
      { name: "Quizzes", grade: 9.3, weight: 20 },
      { name: "Participación", grade: 9.0, weight: 10 },
    ],
  },
  {
    name: "Español",
    teacher: "Prof. Martínez",
    currentGrade: 8.5,
    previousGrade: 8.5,
    assignments: [
      { name: "Ensayo", grade: 8.0, weight: 25 },
      { name: "Exposición", grade: 9.0, weight: 25 },
      { name: "Tareas", grade: 8.5, weight: 30 },
    ],
  },
  {
    name: "Ciencias",
    teacher: "Prof. López",
    currentGrade: 9.8,
    previousGrade: 9.5,
    assignments: [
      { name: "Proyecto", grade: 10, weight: 30 },
      { name: "Laboratorio", grade: 9.5, weight: 25 },
      { name: "Examen", grade: 9.8, weight: 30 },
    ],
  },
  {
    name: "Historia",
    teacher: "Prof. Rodríguez",
    currentGrade: 7.8,
    previousGrade: 8.2,
    assignments: [
      { name: "Examen", grade: 7.5, weight: 40 },
      { name: "Trabajo de investigación", grade: 8.0, weight: 30 },
    ],
  },
];

const overallAverage = 8.83;

export default function StudentGrades() {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-emerald-600";
    if (grade >= 8) return "text-blue-600";
    if (grade >= 7) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (grade: number) => {
    if (grade >= 9) return "bg-emerald-500";
    if (grade >= 8) return "bg-blue-500";
    if (grade >= 7) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Mis Calificaciones"
        description="3° Secundaria - Segundo Trimestre"
      />

      {/* Overall Average Card */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-100 text-sm">Promedio General</p>
            <p className="text-4xl font-bold mt-1">{overallAverage.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">+0.3 vs trimestre anterior</span>
            </div>
          </div>
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
            <Trophy className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-border shadow-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">{subject.teacher}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                  {subject.currentGrade}
                </span>
                {getTrendIcon(subject.currentGrade, subject.previousGrade)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(subject.currentGrade)}`}
                  style={{ width: `${subject.currentGrade * 10}%` }}
                />
              </div>
            </div>

            {/* Assignments Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Desglose</p>
              {subject.assignments.map((assignment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{assignment.name}</span>
                    <span className="text-xs text-muted-foreground">({assignment.weight}%)</span>
                  </div>
                  <span className={`font-medium ${getGradeColor(assignment.grade)}`}>
                    {assignment.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
