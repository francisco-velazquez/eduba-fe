/**
 * Students API Service
 * Handles all student-related API calls
 */

import { httpClient } from "./http-client";

// API Types
export interface ApiStudent {
  userId: string;
  enrollmentCode: string;
  cureentGrade: { // Nota: Se mantiene el nombre del JSON anidado
    id: number | string;
    name: string;
    level: string;
    code: string;
    isActive: boolean;
  } | null;
  user: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isActive: boolean;
    email: string;
    number_phone?: string;
  };
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  gradeId?: string | number;
  dateOfBirth?: string;
  number_phone?: string;
  enrollmentCode?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  gradeId?: string | number;
  isActive?: boolean;
  enrollmentCode?: string;
  number_phone?: string;
  dateOfBirth?: string;
  password?: string;
}

// Map API student to app format
export function mapApiStudent(apiStudent: ApiStudent) {
  return {
    id: apiStudent.userId,
    nombre: `${apiStudent.user.firstName} ${apiStudent.user.lastName}`.trim(),
    firstName: apiStudent.user.firstName,
    lastName: apiStudent.user.lastName,
    email: apiStudent.user.email,
    matricula: apiStudent.enrollmentCode,
    grado: apiStudent.cureentGrade?.name ?? "Sin asignar",
    gradoId: apiStudent.cureentGrade?.id.toString() ?? null,
    estado: apiStudent.user.isActive ? "activo" : "inactivo",
    fechaNacimiento: apiStudent.user.dateOfBirth,
    telefono: apiStudent.user.number_phone,
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
