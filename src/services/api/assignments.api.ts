/**
 * Assignments API Service
 * Handles all assignment-related API calls:
 * - Grade -> Subjects (managed via subjects API)
 * - Teacher -> Subjects
 * - Student -> Grade
 */

import { httpClient } from "./http-client";
import { ApiSubject, mapApiSubject } from "./subjects.api";

// DTO for assigning subjects to a teacher
export interface AssignSubjectsDto {
  subjectIds: number[];
}

// DTO for updating a student's grade
export interface UpdateStudentGradeDto {
  newGradeId: number;
}

// Response types for grade subjects
export interface GradeSubjectResponse {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export const assignmentsApi = {
  /**
   * Get all subjects assigned to a grade
   */
  async getSubjectsByGrade(gradeId: string) {
    const response = await httpClient.get<ApiSubject[]>(`/grades/${gradeId}/subjects`);
    return {
      ...response,
      data: response.data?.map(mapApiSubject) ?? null,
    };
  },

  /**
   * Assign subjects to a teacher
   * PUT /teachers/{userId}/subjects
   */
  async assignSubjectsToTeacher(teacherId: string, data: AssignSubjectsDto) {
    return httpClient.put(`/teachers/${teacherId}/subjects`, data);
  },

  /**
   * Update a student's grade
   * PUT /students/{id}/grade
   */
  async updateStudentGrade(studentId: string, data: UpdateStudentGradeDto) {
    return httpClient.put(`/students/${studentId}/grade`, data);
  },
};
