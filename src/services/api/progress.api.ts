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
        return {
          ...response,
          data: mapApiSubjectProgress(response.data),
        };
      }

      return {
        ...response,
        data: null,
      };
    } catch (error: unknown) {      
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
    const results = await Promise.all(
      subjectIds.map((id) => this.getSubjectProgress(id))
    );


    const progressMap: Record<number, SubjectProgress> = {};
    results.forEach((result, index) => {
      if (result.data) {
        progressMap[subjectIds[index]] = result.data;
      }
    });

    return progressMap;
  },
};
