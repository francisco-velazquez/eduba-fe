/**
 * Subjects Hook
 * React Query hooks for subjects management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsApi, CreateSubjectDto, UpdateSubjectDto } from "@/services/api/subjects.api";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS_KEY = ["subjects"];

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: async () => {
      const response = await subjectsApi.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data ?? [];
    },
  });
}

/**
 * Get subjects for current teacher (same as useSubjects for now)
 * Teachers see all subjects they have access to
 */
export function useTeacherSubjects() {
  return useQuery({
    queryKey: [...SUBJECTS_KEY, "teacher"],
    queryFn: async () => {
      const response = await subjectsApi.getByTeacher();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data ?? [];
    },
  });
}

export function useSubject(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...SUBJECTS_KEY, id],
    queryFn: async () => {
      const response = await subjectsApi.getById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSubjectDto) => {
      const response = await subjectsApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast({
        title: "Asignatura creada",
        description: "La asignatura se ha creado exitosamente.",
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

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSubjectDto }) => {
      const response = await subjectsApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast({
        title: "Asignatura actualizada",
        description: "La asignatura se ha actualizado exitosamente.",
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

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await subjectsApi.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast({
        title: "Baja de asignatura",
        description: "La asignatura se ha dado de baja exitosamente.",
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
