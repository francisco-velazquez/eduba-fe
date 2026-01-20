/**
 * Hook for managing student progress
 * Handles fetching progress and marking chapters as complete
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressApi, SubjectProgress } from "@/services/api/progress.api";
import { useToast } from "./use-toast";

/**
 * Hook to fetch progress for a single subject/course
 */
export function useSubjectProgress(subjectId: number) {
  const query = useQuery({
    queryKey: ["subject-progress", subjectId],
    queryFn: async (): Promise<SubjectProgress | null> => {
      const response = await progressApi.getSubjectProgress(subjectId);
      if (response.error || !response.data) {
        // Return null if there's an error (no progress yet)
        console.warn(`No progress data for subject ${subjectId}:`, response.error);
        return null;
      }
      return response.data;
    },
    enabled: !!subjectId && subjectId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    progress: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook to fetch progress for multiple subjects/courses
 * Used in the courses list view
 */
export function useCoursesProgress(subjectIds: number[]) {
  const query = useQuery<Record<number, SubjectProgress>, Error>({
    queryKey: ["courses-progress", subjectIds],
    queryFn: async () => {
      console.log('Subject IDs:', subjectIds)
      if (subjectIds.length === 0) return {};
      console.log('Fetching progress for subjects:', subjectIds)
      const response = await progressApi.getMultipleSubjectsProgress(subjectIds);
      console.log('Progress Map:', response)
      return response;
    },
    enabled: subjectIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    progressMap: query.data ?? {},
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook to mark a chapter as complete
 */
export function useCompleteChapter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (chapterId: number) => {
      const response = await progressApi.completeChapter(chapterId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all progress queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["subject-progress"] });
      queryClient.invalidateQueries({ queryKey: ["courses-progress"] });
      queryClient.invalidateQueries({ queryKey: ["course-chapters"] });
      
      toast({
        title: "¡Capítulo completado!",
        description: "Tu progreso ha sido guardado.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo marcar el capítulo como completado.",
        variant: "destructive",
      });
    },
  });
}
