/**
 * Teachers hooks for React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teachersApi, CreateTeacherDto, UpdateTeacherDto } from "@/services/api/teachers.api";
import { useToast } from "@/hooks/use-toast";

const QUERY_KEY = ["teachers"];

export function useTeachers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await teachersApi.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data ?? [];
    },
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const response = await teachersApi.getById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTeacherDto) => {
      const response = await teachersApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Maestro creado",
        description: "El maestro se ha creado correctamente",
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

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTeacherDto }) => {
      const response = await teachersApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Maestro actualizado",
        description: "El maestro se ha actualizado correctamente",
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

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await teachersApi.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Maestro eliminado",
        description: "El maestro se ha eliminado correctamente",
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
