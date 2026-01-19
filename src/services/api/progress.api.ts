/**
 * Progress API Service
 * Handles student progress tracking for courses and chapters
 */

import { httpClient } from "./http-client";

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
  progressPercentage: number;
  chapters: ApiChapterProgress[];
}

// App-friendly types
export interface SubjectProgress {
  subjectId: number;
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  completedChapterIds: number[];
}

/**
 * Map API progress response to app format
 */
function mapApiSubjectProgress(response: ApiSubjectProgress): SubjectProgress {
  return {
    subjectId: response.subjectId,
    totalChapters: response.totalChapters,
    completedChapters: response.completedChapters,
    progressPercentage: response.progressPercentage,
    completedChapterIds: response.chapters
      .filter((c) => c.completed)
      .map((c) => c.chapterId),
  };
}

/**
 * Progress API client
 */
export const progressApi = {
  /**
   * Get progress for a specific subject/course
   */
  async getSubjectProgress(subjectId: number): Promise<{ data: SubjectProgress | null; error: string | null; status: number }> {
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
  async getMultipleSubjectsProgress(subjectIds: number[]) {
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
