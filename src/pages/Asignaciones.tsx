import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Users, BookOpen, GraduationCap, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGrades } from "@/hooks/useGrades";
import { useSubjects } from "@/hooks/useSubjects";
import { useTeachers } from "@/hooks/useTeachers";
import { useStudents } from "@/hooks/useStudents";
import { useGradeSubjects, useAssignSubjectsToTeacher, useUpdateStudentGrade } from "@/hooks/useAssignments";
import { LoadingSpinner, EmptyState } from "@/components/common";

export default function Asignaciones() {
  // State for Grade -> Subjects tab
  const [selectedGradoId, setSelectedGradoId] = useState<string>("");
  
  // State for Teacher -> Subjects tab
  const [selectedMaestroId, setSelectedMaestroId] = useState<string>("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  
  // State for Student -> Grade tab
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string>("");
  const [selectedGradoAlumnoId, setSelectedGradoAlumnoId] = useState<string>("");

  // Fetch data
  const { data: grades = [], isLoading: loadingGrades } = useGrades();
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: teachers = [], isLoading: loadingTeachers } = useTeachers();
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: gradeSubjects = [], isLoading: loadingGradeSubjects } = useGradeSubjects(selectedGradoId || null);

  // Mutations
  const assignSubjectsToTeacher = useAssignSubjectsToTeacher();
  const updateStudentGrade = useUpdateStudentGrade();

  // Handle assigning subjects to teacher
  const handleAssignToTeacher = () => {
    if (!selectedMaestroId || selectedSubjectIds.length === 0) return;

    const subjectsIdNumbers = selectedSubjectIds.map((m) => Number(m));
    
    assignSubjectsToTeacher.mutate({
      teacherId: selectedMaestroId,
      data: { subjectIds: subjectsIdNumbers },
    }, {
      onSuccess: () => {
        setSelectedSubjectIds([]);
      }
    });
  };

  // Handle assigning grade to student
  const handleAssignGradeToStudent = () => {
    if (!selectedAlumnoId || !selectedGradoAlumnoId) return;
    
    updateStudentGrade.mutate({
      studentId: selectedAlumnoId,
      data: { newGradeId: Number(selectedGradoAlumnoId) },
    }, {
      onSuccess: () => {
        setSelectedAlumnoId("");
        setSelectedGradoAlumnoId("");
      }
    });
  };

  // Toggle subject selection for teacher assignment
  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Group grades by level
  const gradesByLevel = grades.reduce((acc, grade) => {
    const level = grade.level || "Sin nivel";
    if (!acc[level]) acc[level] = [];
    acc[level].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  // Get selected teacher's current subjects
  const selectedTeacher = teachers.find(t => t.id === selectedMaestroId);

  const isLoading = loadingGrades || loadingSubjects || loadingTeachers || loadingStudents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-header">Asignaciones</h1>
        <p className="page-description">Gestiona las relaciones entre grados, asignaturas, maestros y alumnos</p>
      </div>

      <Tabs defaultValue="grado-asignatura" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="grado-asignatura" className="data-[state=active]:bg-card">
            <GraduationCap className="h-4 w-4 mr-2" />
            Grado → Asignaturas
          </TabsTrigger>
          <TabsTrigger value="maestro-asignatura" className="data-[state=active]:bg-card">
            <BookOpen className="h-4 w-4 mr-2" />
            Maestro → Asignaturas
          </TabsTrigger>
          <TabsTrigger value="alumno-grado" className="data-[state=active]:bg-card">
            <Users className="h-4 w-4 mr-2" />
            Alumno → Grado
          </TabsTrigger>
        </TabsList>

        {/* Grado -> Asignaturas */}
        <TabsContent value="grado-asignatura" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Ver Asignaturas por Grado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Las asignaturas se asignan a los grados al crear o editar una asignatura desde el módulo de Asignaturas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedGradoId} onValueChange={setSelectedGradoId}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccionar grado para ver asignaturas" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={String(grade.id)}>
                      {grade.name} - {grade.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show subjects for selected grade */}
          {selectedGradoId && (
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Asignaturas de {grades.find(g => String(g.id) === selectedGradoId)?.name}
                </h3>
              </div>
              {loadingGradeSubjects ? (
                <LoadingSpinner />
              ) : gradeSubjects.length === 0 ? (
                <p className="text-muted-foreground text-sm">Este grado no tiene asignaturas asignadas.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {gradeSubjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="text-sm py-1 px-3">
                      {subject.nombre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All grades with their subjects count */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(gradesByLevel).map(([level, levelGrades]) => (
              levelGrades.map((grade, index) => (
                <div
                  key={grade.id}
                  className="stat-card animate-fade-in cursor-pointer hover:border-primary/50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedGradoId(String(grade.id))}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{grade.name}</h3>
                      <p className="text-xs text-muted-foreground">{grade.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {grade.subjectsCount} asignaturas
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {grade.studentsCount} alumnos
                    </span>
                  </div>
                </div>
              ))
            ))}
          </div>
        </TabsContent>

        {/* Maestro -> Asignaturas */}
        <TabsContent value="maestro-asignatura" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Asignar Asignaturas a Maestro</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Select value={selectedMaestroId} onValueChange={(value) => {
                  setSelectedMaestroId(value);
                  setSelectedSubjectIds([]);
                }}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccionar maestro" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.filter(t => t.estado === "activo").map((teacher) => (
                      <SelectItem key={teacher.id} value={String(teacher.id)}>
                        {teacher.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Selecciona las asignaturas a asignar</p>
                </div>
              </div>

              {selectedMaestroId && (
                <>
                  <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedSubjectIds.includes(String(subject.id))}
                            onCheckedChange={() => toggleSubjectSelection(String(subject.id))}
                          />
                          <span className="text-sm">{subject.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedSubjectIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-muted-foreground">Seleccionadas:</span>
                      {selectedSubjectIds.map((id) => {
                        const subject = subjects.find(s => String(s.id) === id);
                        return (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1">
                            {subject?.nombre}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => toggleSubjectSelection(id)}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  <Button
                    onClick={handleAssignToTeacher}
                    disabled={selectedSubjectIds.length === 0 || assignSubjectsToTeacher.isPending}
                    className="gradient-primary border-0 w-fit"
                  >
                    {assignSubjectsToTeacher.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Asignar {selectedSubjectIds.length} asignatura(s)
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Current teacher assignments */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.filter(t => t.estado === "activo").map((teacher, index) => (
              <div
                key={teacher.id}
                className={`stat-card animate-fade-in cursor-pointer transition-colors ${
                  selectedMaestroId === String(teacher.id) ? 'border-primary' : 'hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedMaestroId(String(teacher.id))}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {teacher.nombre.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{teacher.nombre}</h3>
                    <p className="text-xs text-muted-foreground">{teacher.especialidad || "Sin especialidad"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.asignaturas && teacher.asignaturas.length > 0 ? (
                    teacher.asignaturas.map((asig) => (
                      <Badge key={asig.id} variant="outline">
                        {asig.nombre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin asignaturas asignadas</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Alumno -> Grado */}
        <TabsContent value="alumno-grado" className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Asignar Grado a Alumno</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Select value={selectedAlumnoId} onValueChange={setSelectedAlumnoId}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccionar alumno" />
                </SelectTrigger>
                <SelectContent>
                  {students.filter(s => s.estado === "activo").map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.nombre} - {student.matricula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
              <Select value={selectedGradoAlumnoId} onValueChange={setSelectedGradoAlumnoId}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={String(grade.id)}>
                      {grade.name} - {grade.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssignGradeToStudent}
                disabled={!selectedAlumnoId || !selectedGradoAlumnoId || updateStudentGrade.isPending}
                className="gradient-primary border-0"
              >
                {updateStudentGrade.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Asignar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Nota:</strong> Un alumno solo puede tener un grado activo a la vez.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Asignaciones Actuales</h3>
            </div>
            {students.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Users}
                  title="No hay alumnos"
                  description="Aún no hay alumnos registrados en el sistema."
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {students.filter(s => s.estado === "activo").map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between px-6 py-4 animate-fade-in hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{student.nombre}</span>
                        <p className="text-xs text-muted-foreground">{student.matricula}</p>
                      </div>
                    </div>
                    <Badge variant={student.grado === "Sin asignar" ? "outline" : "secondary"}>
                      {student.grado}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
