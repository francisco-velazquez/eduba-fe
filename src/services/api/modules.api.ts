/**
 * Modules API Service
 * Handles all module-related API calls
 */

import { Subject } from '@/types';
import { httpClient } from "./http-client";

// API Types
export interface AppChapter {
  id: number;
  title: string;
  videoUrl: string | null;
  contentUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
  moduleId: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiModule {
  id: number;
  title: string;
  description: string | null;
  subjectId: number;
  subject?: {
    id: number;
    name: string;
    isActive: boolean;
    description: string;
    code: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
  chapters: AppChapter[];
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleDto {
  title: string;
  description?: string;
  subjectId: number;
  orderIndex: number;
  isPublished: boolean;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string | null;
  orderIndex?: number;
  isPublished?: boolean;
}

// Map API chapter to app format
export function mapApiChapter(apiChapter: AppChapter) {
  console.log('API Chapter:', apiChapter)
  return {
    id: apiChapter.id,
    title: apiChapter.title,
    videoUrl: apiChapter.videoUrl,
    contentUrl: apiChapter.contentUrl,
    orderIndex: apiChapter.orderIndex,
    isPublished: apiChapter.isPublished,
    moduleId: apiChapter.moduleId,
    createdAt: apiChapter.createdAt,
    updatedAt: apiChapter.updatedAt,
  };
}

// Map API module to app format
export function mapApiModule(apiModule: ApiModule) {
  console.log('API Module:', apiModule)
  return {
    id: apiModule.id,
    nombre: apiModule.title, // Map title to nombre
    descripcion: apiModule.description ?? "",
    subjectId: apiModule.subjectId,
    subject: apiModule.subject ? {
      id: apiModule.subject.id,
      nombre: apiModule.subject.name,
      isActive: apiModule.subject.isActive,
      descripcion: apiModule.subject.description,
      codigo: apiModule.subject.code,
      fechaCreacion: apiModule.subject.createdAt,
      fechaActualizacion: apiModule.subject.updatedAt,
    } : null,
    chapters: apiModule.chapters.map(mapApiChapter),
    orderIndex: apiModule.orderIndex,
    isPublished: apiModule.isPublished,
    fechaCreacion: apiModule.createdAt,
    fechaActualizacion: apiModule.updatedAt,
  };
}

export type AppModule = ReturnType<typeof mapApiModule>;

export const modulesApi = {
  /**
   * Create new module
   */
  async create(data: CreateModuleDto) {
    const response = await httpClient.post<ApiModule>("/modules", data);
    return {
      ...response,
      data: response.data ? mapApiModule(response.data) : null,
    };
  },

  /**
   * Update existing module
   */
  async update(id: number, data: UpdateModuleDto) {
    const response = await httpClient.put<ApiModule>(`/modules/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiModule(response.data) : null,
    };
  },
};