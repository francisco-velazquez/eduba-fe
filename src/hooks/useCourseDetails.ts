/**
 * Hook for fetching course details for the course viewer
 * Loads course info and chapters from the API
 */

import { useQuery } from "@tanstack/react-query";
import { useStudentCourses } from "./useStudentCourses";
import { chaptersApi, AppChapter } from "@/services/api/chapters.api";

export interface CourseChapter {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  type: "video" | "pdf" | "content";
  videoUrl: string | null;
  contentUrl: string | null;
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

// Determine chapter type based on available URLs
function getChapterType(chapter: AppChapter): "video" | "pdf" | "content" {
  if (chapter.videoUrl) return "video";
  if (chapter.contentUrl) {
    const url = chapter.contentUrl.toLowerCase();
    if (url.endsWith(".pdf")) return "pdf";
  }
  return "content";
}

export function useCourseDetails(courseId: number) {
  const { courses, isLoading: isLoadingCourses, isError: coursesError } = useStudentCourses();

  const course = courses.find((c) => c.id === courseId);

  // Fetch chapters for all modules
  const {
    data: chaptersData,
    isLoading: isLoadingChapters,
    isError: chaptersError,
  } = useQuery({
    queryKey: ["course-chapters", courseId, course?.modules.map((m) => m.id)],
    queryFn: async () => {
      if (!course) return {};
      
      // Fetch chapters for all modules in parallel
      const results = await Promise.all(
        course.modules.map(async (module) => {
          const response = await chaptersApi.getByModule(module.id);
          return {
            moduleId: module.id,
            chapters: response.data || [],
          };
        })
      );

      // Create a map of moduleId -> chapters
      const chaptersMap: Record<number, AppChapter[]> = {};
      results.forEach((result) => {
        chaptersMap[result.moduleId] = result.chapters.sort(
          (a, b) => a.orderIndex - b.orderIndex
        );
      });

      return chaptersMap;
    },
    enabled: !!course && course.modules.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Build course details with chapters
  const courseDetails: CourseDetails | null = course
    ? {
        id: course.id,
        name: course.name,
        description: course.description,
        code: course.code,
        grade: course.grade,
        modules: course.modules.map((module) => {
          const moduleChapters = chaptersData?.[module.id] || [];
          const publishedChapters = moduleChapters.filter((c) => c.isPublished);

          return {
            id: module.id,
            title: module.title,
            orderIndex: module.orderIndex,
            isPublished: module.isPublished,
            completed: false, // Placeholder until progress tracking
            chapters: publishedChapters.map((chapter, index) => ({
              id: chapter.id,
              title: chapter.nombre,
              description: chapter.descripcion,
              orderIndex: chapter.orderIndex,
              type: getChapterType(chapter),
              videoUrl: chapter.videoUrl,
              contentUrl: chapter.contentUrl,
              completed: false, // Placeholder until progress tracking
              current: index === 0 && module.orderIndex === 1, // First chapter of first module
            })),
          };
        }),
        progress: course.progress,
        totalChapters: Object.values(chaptersData || {}).flat().filter((c) => c.isPublished).length,
        completedChapters: 0,
      }
    : null;

  return {
    course: courseDetails,
    isLoading: isLoadingCourses || isLoadingChapters,
    isError: coursesError || chaptersError,
    notFound: !isLoadingCourses && !course,
  };
}
