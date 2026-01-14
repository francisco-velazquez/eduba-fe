/**
 * Modules Hook
 * React Query hooks for modules management
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modulesApi, CreateModuleDto, UpdateModuleDto } from "@/services/api/modules.api";
import { useToast } from "@/hooks/use-toast";

const MODULES_KEY = ["modules"];

export function useCreateModule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateModuleDto) => {
      const response = await modulesApi.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the subject query to refetch the content
      queryClient.invalidateQueries({ queryKey: ["subjects", String(data?.subjectId)] });
      toast({
        title: "Módulo creado",
        description: "El módulo se ha creado exitosamente.",
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

export function useUpdateModule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateModuleDto }) => {
      const response = await modulesApi.update(id, data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the subject query to refetch the content
      queryClient.invalidateQueries({ queryKey: ["subjects", String(data?.subjectId)] });
      toast({
        title: "Módulo actualizado",
        description: "El módulo se ha actualizado exitosamente.",
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