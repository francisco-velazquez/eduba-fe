/**
 * Subjects API Service
 * Handles all subject-related API calls
 */

import { httpClient } from "./http-client";

// API Types
export interface ApiSubject {
  id: string;
  name: string;
  description?: string;
  code?: string;
  gradeId?: string;
  gradeName?: string;
  grades?: { id: string; name: string }[];
  teacherId?: string;
  teacherName?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
  code?: string;
  gradeId?: string;
  teacherId?: string;
  color?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
  code?: string;
  gradeId?: string;
  teacherId?: string;
  color?: string;
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
  const gradeNames = apiSubject.grades?.map(g => g.name) ?? 
    (apiSubject.gradeName ? [apiSubject.gradeName] : []);

  return {
    id: apiSubject.id,
    nombre: apiSubject.name,
    descripcion: apiSubject.description ?? "",
    codigo: apiSubject.code,
    grados: gradeNames,
    maestro: apiSubject.teacherName ?? "Sin asignar",
    maestroId: apiSubject.teacherId,
    color: apiSubject.color ?? defaultColors[index % defaultColors.length],
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
