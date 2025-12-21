/**
 * Grades API Service
 * Handles all grade-related API calls
 */

import { httpClient } from "./http-client";

// API Types
export interface ApiGrade {
  id: string;
  name: string;
  level: string;
  description?: string;
  studentsCount?: number;
  subjectsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGradeDto {
  name: string;
  level: string;
  description?: string;
}

export interface UpdateGradeDto {
  name?: string;
  level?: string;
  description?: string;
}

// Map API grade to app format
export function mapApiGrade(apiGrade: ApiGrade) {
  return {
    id: apiGrade.id,
    nombre: apiGrade.name,
    nivel: apiGrade.level,
    descripcion: apiGrade.description,
    alumnos: apiGrade.studentsCount ?? 0,
    asignaturas: apiGrade.subjectsCount ?? 0,
  };
}

export type AppGrade = ReturnType<typeof mapApiGrade>;

export const gradesApi = {
  /**
   * Get all grades
   */
  async getAll() {
    const response = await httpClient.get<ApiGrade[]>("/grades");
    return {
      ...response,
      data: response.data?.map(mapApiGrade) ?? null,
    };
  },

  /**
   * Get grade by ID
   */
  async getById(id: string) {
    const response = await httpClient.get<ApiGrade>(`/grades/${id}`);
    return {
      ...response,
      data: response.data ? mapApiGrade(response.data) : null,
    };
  },

  /**
   * Create new grade
   */
  async create(data: CreateGradeDto) {
    const response = await httpClient.post<ApiGrade>("/grades", data);
    return {
      ...response,
      data: response.data ? mapApiGrade(response.data) : null,
    };
  },

  /**
   * Update grade
   */
  async update(id: string, data: UpdateGradeDto) {
    const response = await httpClient.put<ApiGrade>(`/grades/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiGrade(response.data) : null,
    };
  },

  /**
   * Delete grade
   */
  async delete(id: string) {
    return httpClient.delete(`/grades/${id}`);
  },

  /**
   * Get subjects by grade
   */
  async getSubjects(gradeId: string) {
    return httpClient.get(`/grades/${gradeId}/subjects`);
  },
};
