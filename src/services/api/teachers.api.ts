/**
 * Teachers API Service
 * Handles all teacher-related API calls
 */

import { httpClient } from "./http-client";

// API Types
export interface ApiTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  subjects?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  password: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}

// Map API teacher to app format
export function mapApiTeacher(apiTeacher: ApiTeacher) {
  const subjectNames = apiTeacher.subjects?.map(s => s.name) ?? [];

  return {
    id: apiTeacher.id,
    nombre: `${apiTeacher.firstName} ${apiTeacher.lastName}`.trim(),
    firstName: apiTeacher.firstName,
    lastName: apiTeacher.lastName,
    email: apiTeacher.email,
    telefono: apiTeacher.phone ?? "",
    fechaNacimiento: apiTeacher.dateOfBirth,
    asignaturas: subjectNames,
    estado: apiTeacher.isActive ? "activo" : "inactivo",
  };
}

export type AppTeacher = ReturnType<typeof mapApiTeacher>;

export const teachersApi = {
  /**
   * Get all teachers
   */
  async getAll() {
    const response = await httpClient.get<ApiTeacher[]>("/teachers");
    return {
      ...response,
      data: response.data?.map(mapApiTeacher) ?? null,
    };
  },

  /**
   * Get teacher by ID
   */
  async getById(id: string) {
    const response = await httpClient.get<ApiTeacher>(`/teachers/${id}`);
    return {
      ...response,
      data: response.data ? mapApiTeacher(response.data) : null,
    };
  },

  /**
   * Create new teacher
   */
  async create(data: CreateTeacherDto) {
    const response = await httpClient.post<ApiTeacher>("/teachers", data);
    return {
      ...response,
      data: response.data ? mapApiTeacher(response.data) : null,
    };
  },

  /**
   * Update teacher
   */
  async update(id: string, data: UpdateTeacherDto) {
    const response = await httpClient.put<ApiTeacher>(`/teachers/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiTeacher(response.data) : null,
    };
  },

  /**
   * Delete teacher
   */
  async delete(id: string) {
    return httpClient.delete(`/teachers/${id}`);
  },
};
