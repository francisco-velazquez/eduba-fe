/**
 * Students API Service
 * Handles all student-related API calls
 */

import { httpClient } from "./http-client";

// API Types
export interface ApiStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNumber?: string;
  isActive: boolean;
  grade?: { id: string; name: string };
  gradeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gradeId?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  gradeId?: string;
  isActive?: boolean;
}

// Map API student to app format
export function mapApiStudent(apiStudent: ApiStudent) {
  return {
    id: apiStudent.id,
    nombre: `${apiStudent.firstName} ${apiStudent.lastName}`.trim(),
    firstName: apiStudent.firstName,
    lastName: apiStudent.lastName,
    email: apiStudent.email,
    matricula: apiStudent.enrollmentNumber ?? apiStudent.id.slice(0, 8).toUpperCase(),
    grado: apiStudent.grade?.name ?? "Sin asignar",
    gradoId: apiStudent.gradeId ?? apiStudent.grade?.id,
    estado: apiStudent.isActive ? "activo" : "inactivo",
  };
}

export type AppStudent = ReturnType<typeof mapApiStudent>;

export const studentsApi = {
  /**
   * Get all students
   */
  async getAll() {
    const response = await httpClient.get<ApiStudent[]>("/students");
    return {
      ...response,
      data: response.data?.map(mapApiStudent) ?? null,
    };
  },

  /**
   * Get student by ID
   */
  async getById(id: string) {
    const response = await httpClient.get<ApiStudent>(`/students/${id}`);
    return {
      ...response,
      data: response.data ? mapApiStudent(response.data) : null,
    };
  },

  /**
   * Create new student
   */
  async create(data: CreateStudentDto) {
    const response = await httpClient.post<ApiStudent>("/students", data);
    return {
      ...response,
      data: response.data ? mapApiStudent(response.data) : null,
    };
  },

  /**
   * Update student
   */
  async update(id: string, data: UpdateStudentDto) {
    const response = await httpClient.put<ApiStudent>(`/students/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiStudent(response.data) : null,
    };
  },

  /**
   * Delete student
   */
  async delete(id: string) {
    return httpClient.delete(`/students/${id}`);
  },
};
