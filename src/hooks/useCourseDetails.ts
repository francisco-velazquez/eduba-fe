/**
 * Hook for fetching course details for the course viewer
 */

import { useQuery } from "@tanstack/react-query";
import { useStudentCourses } from "./useStudentCourses";

export interface CourseChapter {
  id: number;
  title: string;
  orderIndex: number;
  type: "video" | "pdf" | "content";
  duration?: string;
  completed: boolean;
  current: boolean;
}

export interface CourseModule {
  id: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;
  completed: boolean;
  chapters: CourseChapter[];
}

export interface CourseDetails {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  grade: {
    id: number;
    name: string;
    level: string;
    code: string;
  };
  modules: CourseModule[];
  progress: number;
  totalChapters: number;
  completedChapters: number;
}

export function useCourseDetails(courseId: number) {
  const { courses, isLoading: isLoadingCourses, isError, error } = useStudentCourses();

  const course = courses.find((c) => c.id === courseId);

  // Transform the course data to include chapter structure
  // For now, we'll create placeholder chapters since the API only returns modules
  const courseDetails: CourseDetails | null = course
    ? {
        id: course.id,
        name: course.name,
        description: course.description,
        code: course.code,
        grade: course.grade,
        modules: course.modules.map((module, moduleIndex) => ({
          id: module.id,
          title: module.title,
          orderIndex: module.orderIndex,
          isPublished: module.isPublished,
          completed: false, // Placeholder until progress tracking
          chapters: [
            // Placeholder chapters - in a real implementation, these would come from the API
            {
              id: module.id * 100 + 1,
              title: `Introducción a ${module.title}`,
              orderIndex: 1,
              type: "video" as const,
              duration: "15:00",
              completed: false,
              current: moduleIndex === 0,
            },
            {
              id: module.id * 100 + 2,
              title: `Material de estudio`,
              orderIndex: 2,
              type: "pdf" as const,
              completed: false,
              current: false,
            },
          ],
        })),
        progress: course.progress,
        totalChapters: course.modules.length * 2, // Placeholder calculation
        completedChapters: 0,
      }
    : null;

  return {
    course: courseDetails,
    isLoading: isLoadingCourses,
    isError,
    error,
    notFound: !isLoadingCourses && !course,
  };
}
