/**
 * Hook for fetching student courses/subjects
 */

import { useQuery } from "@tanstack/react-query";
import { studentSubjectsApi, AppStudentSubjectsData } from "@/services/api/student-subjects.api";
import { useAuth } from "./useAuth";

export function useStudentCourses() {
  const { user } = useAuth();
  const studentId = user?.id;

  const query = useQuery<AppStudentSubjectsData | null, Error>({
    queryKey: ["student-courses", studentId],
    queryFn: async () => {
      if (!studentId) {
        throw new Error("No student ID available");
      }
      const response = await studentSubjectsApi.getSubjects(studentId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: query.data,
    courses: query.data?.courses ?? [],
    currentGrade: query.data?.currentGrade ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
