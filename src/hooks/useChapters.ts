import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chaptersApi, CreateChapterData } from "@/services/api/chapters.api";

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChapterData) => chaptersApi.create(data),
    onSuccess: () => {
      // Invalidamos la query de la asignatura para que se recarguen los módulos y capítulos
      queryClient.invalidateQueries({ queryKey: ["subject"] });
    },
  });
};
