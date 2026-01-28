/**
 * Exams Hook
 * React Query hooks for exam management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  examsApi,
  CreateExamDto,
  UpdateExamDto,
  SubmitExamDto,
  AppExam,
  ExamResultResponse,
} from "@/services/api/exams.api";
import { useToast } from "@/hooks/use-toast";

const EXAMS_KEY = ["exams"];
const EXAM_RESULTS_KEY = ["exam-results"];

// ==================== Query Hooks ====================
/**
 * Get all exams (for teachers)
 */
export function useExamsByTeacher() {
  return useQuery({
    queryKey: EXAMS_KEY,
    queryFn: async () => {
      const response = await examsApi.getAllByTeacher();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

/**
 * Get exam by ID
 */
export function useExam(id: number | undefined) {
  return useQuery({
    queryKey: [...EXAMS_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await examsApi.getById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Get exam by module ID
 */
export function useExamByModule(moduleId: number | undefined) {
  return useQuery({
    queryKey: [...EXAMS_KEY, "module", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      const response = await examsApi.getByModuleId(moduleId);
      if (response.error) {
        // Module might not have an exam yet
        return null;
      }
      return response.data;
    },
    enabled: !!moduleId,
  });
}

/**
 * Get exam by subject ID
 */
export function useExamBySubject(subjectId: number | undefined) {
  return useQuery({
    queryKey: [...EXAMS_KEY, subjectId],
    queryFn: async () => {
      const response = await examsApi.getBySubjectId(subjectId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

/**
 * Get exmas for teachers, optionally filtered by subject ID
 */
export function useExamsForTeachers(subjectId?: number) {
  return useQuery({
    // 1. Estructura la key de forma jerárquica
    queryKey: subjectId ? [...EXAMS_KEY, 'subject', subjectId] : [...EXAMS_KEY, 'all'],
    
    // 2. Separa la lógica de obtención de datos
    queryFn: async () => {
      const response = subjectId !== undefined 
        ? await examsApi.getBySubjectId(subjectId)
        : await examsApi.getAllByTeacher();

      if (response.error) {
        throw new Error(response.error);
      }
      
      // Aseguramos que devolvemos un array vacío en caso de null/undefined si la API es inconsistente
      return response.data ?? [];
    },
    
    // 3. Opcional: Evita que la query se ejecute si necesitas lógica condicional externa
    enabled: Boolean(subjectId) || subjectId === undefined, 
  });
}

/**
 * Get available exams for student
 */
export function useAvailableExams() {
  return useQuery({
    queryKey: [...EXAMS_KEY, "available"],
    queryFn: async () => {
      const response = await examsApi.getAvailableForStudent();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

/**
 * Get student exam results
 */
export function useStudentExamResults() {
  return useQuery({
    queryKey: EXAM_RESULTS_KEY,
    queryFn: async () => {
      const response = await examsApi.getStudentResults();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}

// ==================== Mutation Hooks ====================

/**
 * Create new exam
 */
export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateExamDto) => {
      const response = await examsApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
      toast({
        title: "Examen creado",
        description: "El examen se ha creado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Update exam
 */
export function useUpdateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExamDto }) => {
      const response = await examsApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
      toast({
        title: "Examen actualizado",
        description: "El examen se ha actualizado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete exam
 */
export function useDeleteExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await examsApi.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY });
      toast({
        title: "Examen eliminado",
        description: "El examen se ha eliminado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Submit exam answers (student)
 */
export function useSubmitExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      examId,
      data,
    }: {
      examId: number;
      data: SubmitExamDto;
    }): Promise<ExamResultResponse> => {
      const response = await examsApi.submit(examId, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as ExamResultResponse;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: EXAM_RESULTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, "available"] });
      
      const message = result.passed
        ? `¡Felicidades! Obtuviste ${result.score}% (${result.correctAnswers}/${result.totalQuestions} correctas)`
        : `Obtuviste ${result.score}% (${result.correctAnswers}/${result.totalQuestions} correctas). ¡Sigue practicando!`;
      
      toast({
        title: result.passed ? "¡Examen aprobado!" : "Examen completado",
        description: message,
        variant: result.passed ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
