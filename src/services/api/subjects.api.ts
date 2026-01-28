/**
 * Subjects API Service
 * Handles all subject-related API calls
 */

import { httpClient } from "./http-client";
import { ApiModule, mapApiModule } from "./modules.api";

// API Types
export interface ApiGrade {
  id: number | string;
  name: string;
  level?: string;
  code?: string;
  isActive?: boolean;
}

export interface ApiSubject {
  id: number | string;
  name: string;
  description?: string;
  code?: string;
  isActive?: boolean;
  grade?: ApiGrade;
  gradeId?: number | string;
  gradeName?: string;
  grades?: { id: string; name: string }[];
  teacherId?: string;
  teacherName?: string;
  color?: string;
  modules?: ApiModule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
  code?: string;
  gradeId?: number;
  teacherId?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
  code?: string;
  gradeId?: number;
  teacherId?: string;
  color?: string;
  isActive?: boolean;
}

// Color mapping for subjects
const defaultColors = [
  "bg-blue-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-pink-500",
];

// Map API subject to app format
export function mapApiSubject(apiSubject: ApiSubject, index: number = 0) {
  // Handle grade data: prefer grade object, then gradeName, then grades array
  let gradeId: string | undefined;
  const gradeNames: string[] = [];

  if (apiSubject.grade) {
    // Grade object from API (e.g., from getById endpoint)
    gradeId = String(apiSubject.grade.id);
    gradeNames.push(apiSubject.grade.name);
  } else if (apiSubject.gradeId) {
    // Direct gradeId
    gradeId = String(apiSubject.gradeId);
    if (apiSubject.gradeName) {
      gradeNames.push(apiSubject.gradeName);
    }
  } else if (apiSubject.grades && apiSubject.grades.length > 0) {
    // Grades array (from getAll endpoint)
    gradeNames.push(...apiSubject.grades.map(g => g.name));
    gradeId = apiSubject.grades[0]?.id ? String(apiSubject.grades[0].id) : undefined;
  } else if (apiSubject.gradeName) {
    // Fallback to gradeName only
    gradeNames.push(apiSubject.gradeName);
  }

  return {
    id: String(apiSubject.id),
    nombre: apiSubject.name,
    descripcion: apiSubject.description ?? "",
    codigo: apiSubject.code,
    grados: gradeNames,
    gradeId: gradeId, // Add gradeId to the mapped subject
    maestro: apiSubject.teacherName ?? "Sin asignar",
    maestroId: apiSubject.teacherId,
    color: apiSubject.color ?? defaultColors[index % defaultColors.length],
    isActive: apiSubject.isActive ?? true, // Default to active if not specified
    modules: apiSubject.modules?.map(mapApiModule) ?? [],
  };
}

export type AppSubject = ReturnType<typeof mapApiSubject>;

export const subjectsApi = {
  /**
   * Get all subjects
   */
  async getAll() {
    const response = await httpClient.get<ApiSubject[]>("/subjects");
    return {
      ...response,
      data: response.data?.map((s, i) => mapApiSubject(s, i)) ?? null,
    };
  },

  /**
   * Get subject by ID
   */
  async getById(id: string) {
    const response = await httpClient.get<ApiSubject>(`/subjects/${id}`);
    return {
      ...response,
      data: response.data ? mapApiSubject(response.data) : null,
    };
  },

  /**
   * Get subjects for current teacher
   */
  async getByTeacher() {
    const response = await httpClient.get<ApiSubject[]>("/subjects/by-teacher");
    return {
      ...response,
      data: response.data?.map((s, i) => mapApiSubject(s, i)) ?? null,
    };
  },

  /**
   * Create new subject
   */
  async create(data: CreateSubjectDto) {
    const response = await httpClient.post<ApiSubject>("/subjects", data);
    return {
      ...response,
      data: response.data ? mapApiSubject(response.data) : null,
    };
  },

  /**
   * Update subject
   */
  async update(id: string, data: UpdateSubjectDto) {
    const response = await httpClient.put<ApiSubject>(`/subjects/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiSubject(response.data) : null,
    };
  },

  /**
   * Delete subject
   */
  async delete(id: string) {
    return httpClient.delete(`/subjects/${id}`);
  },
};
