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

export const useReorderChapters = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { moduleId: number; chapterIds: (number | string)[] }) =>
      chaptersApi.reorder(data.moduleId, data.chapterIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject"] });
    },
  });
};
