/**
 * Teachers API Service
 * Handles all teacher-related API calls
 */

import { httpClient } from "./http-client";
import { ApiSubject, mapApiSubject } from "./subjects.api";

// API Types
export interface ApiTeacher {
  userId: string;
  employeeNumber: string;
  specialty: string | null;
  user: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isActive: boolean;
    email: string;
    number_phone?: string;
  };
  subjects: ApiSubject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  number_phone?: string;
  dateOfBirth: string;
  password: string;
  employeeNumber?: string;
  specialty?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  number_phone?: string;
  dateOfBirth?: string;
  employeeNumber?: string;
  password?: string;
  isActive?: boolean;
}

// Map API teacher to app format
export function mapApiTeacher(apiTeacher: ApiTeacher) {
  return {
    id: apiTeacher.userId,
    nombre: `${apiTeacher.user.firstName} ${apiTeacher.user.lastName}`.trim(),
    firstName: apiTeacher.user.firstName,
    lastName: apiTeacher.user.lastName,
    email: apiTeacher.user.email,
    employeeNumber: apiTeacher.employeeNumber ?? "",
    fechaNacimiento: apiTeacher.user.dateOfBirth,
    especialidad: apiTeacher.specialty ?? "",
    asignaturas: apiTeacher.subjects?.map(mapApiSubject) ?? [],
    estado: apiTeacher.user.isActive ? "activo" : "inactivo",
    fechaCreacion: apiTeacher.createdAt,
    fechaActualizacion: apiTeacher.updatedAt,
    telefono: apiTeacher.user.number_phone ?? ""
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
