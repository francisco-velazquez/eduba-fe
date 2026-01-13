/**
 * Grades Hook
 * React Query hooks for grades management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gradesApi, CreateGradeDto, UpdateGradeDto } from "@/services/api/grades.api";
import { useToast } from "@/hooks/use-toast";

const GRADES_KEY = ["grades"];

export function useGrades() {
  return useQuery({
    queryKey: GRADES_KEY,
    queryFn: async () => {
      const response = await gradesApi.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data ?? [];
    },
  });
}

export function useGrade(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...GRADES_KEY, id],
    queryFn: async () => {
      const response = await gradesApi.getById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateGradeDto) => {
      const response = await gradesApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADES_KEY });
      toast({
        title: "Grado creado",
        description: "El grado se ha creado exitosamente.",
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

export function useUpdateGrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGradeDto }) => {
      const response = await gradesApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADES_KEY });
      toast({
        title: "Grado actualizado",
        description: "El grado se ha actualizado exitosamente.",
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

export function useDeleteGrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gradesApi.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADES_KEY });
      toast({
        title: "Grado eliminado",
        description: "El grado se ha eliminado exitosamente.",
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
