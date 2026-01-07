/**
 * Students hooks for React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi, CreateStudentDto, UpdateStudentDto } from "@/services/api/students.api";
import { useToast } from "@/hooks/use-toast";

const QUERY_KEY = ["students"];

export function useStudents() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await studentsApi.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data ?? [];
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const response = await studentsApi.getById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateStudentDto) => {
      const response = await studentsApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Alumno creado",
        description: "El alumno se ha creado correctamente",
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

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
      const response = await studentsApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Alumno actualizado",
        description: "El alumno se ha actualizado correctamente",
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

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await studentsApi.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Alumno eliminado",
        description: "El alumno se ha eliminado correctamente",
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
