/**
 * Student Subjects API Service
 * Handles fetching subjects assigned to a student
 */

import { httpClient } from "./http-client";

// API Types for Student Subjects Response
export interface ApiStudentGrade {
  id: number;
  name: string;
  level: string;
  code: string;
  isActive: boolean;
}

export interface ApiSubjectModule {
  id: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;
  subjectId: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiStudentSubject {
  id: number;
  name: string;
  isActive: boolean;
  grade: ApiStudentGrade;
  modules: ApiSubjectModule[];
  description: string | null;
  code: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiStudentSubjectsResponse {
  studentId: string;
  currentGrade: ApiStudentGrade | null;
  subjects: ApiStudentSubject[];
}

// Mapped types for app usage
export interface AppStudentCourse {
  id: number;
  name: string;
  description: string | null;
  code: string | null;
  isActive: boolean;
  grade: {
    id: number;
    name: string;
    level: string;
    code: string;
  };
  modules: {
    id: number;
    title: string;
    orderIndex: number;
    isPublished: boolean;
  }[];
  totalModules: number;
  completedModules: number; // For now, this will be 0 until we have progress tracking
  progress: number;
  lastAccessed: string | null;
}

export interface AppStudentSubjectsData {
  studentId: string;
  currentGrade: ApiStudentGrade | null;
  courses: AppStudentCourse[];
}

// Color palette for courses based on index
const courseColors = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "cyan",
  "indigo",
  "teal",
  "orange",
  "pink",
];

export function getCourseColor(index: number): string {
  return courseColors[index % courseColors.length];
}

// Map API response to app format
export function mapApiStudentSubjects(response: ApiStudentSubjectsResponse): AppStudentSubjectsData {
  return {
    studentId: response.studentId,
    currentGrade: response.currentGrade,
    courses: response.subjects.map((subject) => {
      const publishedModules = subject.modules.filter((m) => m.isPublished);
      return {
        id: subject.id,
        name: subject.name.trim(),
        description: subject.description,
        code: subject.code,
        isActive: subject.isActive,
        grade: {
          id: subject.grade.id,
          name: subject.grade.name,
          level: subject.grade.level,
          code: subject.grade.code,
        },
        modules: publishedModules.map((m) => ({
          id: m.id,
          title: m.title,
          orderIndex: m.orderIndex,
          isPublished: m.isPublished,
        })),
        totalModules: publishedModules.length,
        completedModules: 0, // Placeholder until progress tracking is implemented
        progress: 0, // Placeholder until progress tracking is implemented
        lastAccessed: null, // Placeholder until activity tracking is implemented
      };
    }),
  };
}

export const studentSubjectsApi = {
  /**
   * Get subjects assigned to a student
   * @param studentId - The UUID of the student
   */
  async getSubjects(studentId: string) {
    const response = await httpClient.get<ApiStudentSubjectsResponse>(
      `/students/${studentId}/subjects`
    );
    return {
      ...response,
      data: response.data ? mapApiStudentSubjects(response.data) : null,
    };
  },
};
