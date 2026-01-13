/**
 * Assignments Hooks
 * React Query hooks for managing assignments
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi, AssignSubjectsDto, UpdateStudentGradeDto } from "@/services/api/assignments.api";
import { useToast } from "@/hooks/use-toast";

// Query keys
const ASSIGNMENTS_KEYS = {
  gradeSubjects: (gradeId: string) => ["assignments", "grade-subjects", gradeId] as const,
  teacherSubjects: ["assignments", "teacher-subjects"] as const,
  studentGrades: ["assignments", "student-grades"] as const,
};

/**
 * Get subjects by grade
 */
export function useGradeSubjects(gradeId: string | null) {
  return useQuery({
    queryKey: ASSIGNMENTS_KEYS.gradeSubjects(gradeId ?? ""),
    queryFn: async () => {
      if (!gradeId) return [];
      const response = await assignmentsApi.getSubjectsByGrade(gradeId);
      if (response.error) throw new Error(response.error);
      return response.data ?? [];
    },
    enabled: !!gradeId,
  });
}

/**
 * Assign subjects to a teacher
 */
export function useAssignSubjectsToTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ teacherId, data }: { teacherId: string; data: AssignSubjectsDto }) => {
      const response = await assignmentsApi.assignSubjectsToTeacher(teacherId, data);
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({
        title: "Asignaturas asignadas",
        description: "Las asignaturas han sido asignadas al maestro correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al asignar asignaturas",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Update a student's grade
 */
export function useUpdateStudentGrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ studentId, data }: { studentId: string; data: UpdateStudentGradeDto }) => {
      const response = await assignmentsApi.updateStudentGrade(studentId, data);
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Grado asignado",
        description: "El grado ha sido asignado al alumno correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al asignar grado",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
