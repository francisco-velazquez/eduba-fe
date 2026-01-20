/**
 * Progress API Service
 * Handles student progress tracking for courses and chapters
 */

import { httpClient, ApiError, ApiResponse } from "./http-client";

// API Types for Progress
export interface ApiChapterProgress {
  id: number;
  chapterId: number;
  studentId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface ApiSubjectProgress {
  subjectId: number;
  studentId: string;
  totalChapters: number;
  completedChapters: number;
  percentage: number;
  completedChapterIds: number[];
  lastActivityAt?: Date;
  finishedAt?: Date | null;
}

// App-friendly types
export interface SubjectProgress {
  subjectId: number;
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  completedChapterIds: number[];
  lastActivityAt?: Date;
  finishedAt?: Date | null;
}

/**
 * Map API progress response to app format
 */
function mapApiSubjectProgress(response: ApiSubjectProgress): SubjectProgress {
  return {
    subjectId: response.subjectId,
    totalChapters: response.totalChapters,
    completedChapters: response.completedChapters,
    progressPercentage: response.percentage,
    completedChapterIds: response.completedChapterIds,
    lastActivityAt: response.lastActivityAt,
    finishedAt: response.finishedAt,
  };
}

/**
 * Progress API client
 */
export const progressApi = {
  /**
   * Get progress for a specific subject/course
   */
  async getSubjectProgress(subjectId: number): Promise<ApiResponse<SubjectProgress>> {
    try {
      const response = await httpClient.get<ApiSubjectProgress>(
        `/progress/subject/${subjectId}`
      );

      if (response.data) {
        console.log("Progress data for subject", subjectId, response.data)
        return {
          ...response,
          data: mapApiSubjectProgress(response.data),
        };
      }

      console.log("No progress data for subject", subjectId)

      return {
        ...response,
        data: null,
      };
    } catch (error: unknown) {
      console.error(`Error fetching progress for subject ${subjectId}:`, error);
      
      const err = error as ApiError;

      // Retornamos un objeto de error controlado en lugar de lanzar la excepción
      return {
        data: null,
        error: err?.message || "Error fetching progress",
        status: err?.response?.status || 500
      };
    }
  },

  /**
   * Mark a chapter as complete
   */
  async completeChapter(chapterId: number) {
    return httpClient.post<ApiChapterProgress>(
      `/progress/chapter/${chapterId}/complete`
    );
  },

  /**
   * Get progress for multiple subjects at once
   * Fetches in parallel for efficiency
   */
  async getMultipleSubjectsProgress(subjectIds: number[]): Promise<Record<number, SubjectProgress>> {
    console.log("Fetching progress for subjects:", subjectIds)
    const results = await Promise.all(
      subjectIds.map((id) => this.getSubjectProgress(id))
    );

    console.log("Progress Map Result:", results)

    const progressMap: Record<number, SubjectProgress> = {};
    console.log("Progress Map Before:", progressMap)
    results.forEach((result, index) => {
      console.log("Result:", result.data)
      if (result.data) {
        console.log("Subject ID:", subjectIds[index])
        progressMap[subjectIds[index]] = result.data;
      }
    });

    console.log("Progress Map API:", progressMap)

    return progressMap;
  },
};
