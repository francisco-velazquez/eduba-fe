/**
 * src/services/api/chapters.api.ts
 */

import { httpClient } from "./http-client";

// API Types
export interface CreateChapterData {
  title: string;
  moduleId: number;
  videoUrl?: string;
  contentUrl?: string;
  orderIndex: number;
  isPublished: boolean;
}

export interface ApiChapter {
  id: number;
  title: string;
  description: string | null;
  moduleId: number;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChapterDto {
  title: string;
  description?: string;
  moduleId: number;
  orderIndex: number;
  isPublished: boolean;
}

export interface UpdateChapterDto {
  title?: string;
  description?: string | null;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface RequestUploadDto {
  fileName: string;
  contentType: string;
  type: "video" | "content";
}

export interface RequestUploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface ConfirmUploadDto {
  fileUrl: string;
  type: "video" | "content";
}

// Map API chapter to app format
export function mapApiChapter(apiChapter: ApiChapter) {
  return {
    id: apiChapter.id,
    nombre: apiChapter.title,
    descripcion: apiChapter.description ?? "",
    moduleId: apiChapter.moduleId,
    orderIndex: apiChapter.orderIndex,
    isPublished: apiChapter.isPublished,
    fechaCreacion: apiChapter.createdAt,
    fechaActualizacion: apiChapter.updatedAt,
  };
}

export type AppChapter = ReturnType<typeof mapApiChapter>;

export const uploadChapterFile = async (
  chapterId: number,
  file: File,
  type: "video" | "content"
) => {
  // 1. Request Upload URL
  const requestRes = await httpClient.post<RequestUploadResponse>(
    `/chapters/${chapterId}/request-upload`,
    {
      fileName: file.name,
      contentType: file.type,
      type,
    }
  );

  if (!requestRes.data) {
    throw new Error(requestRes.error || "No se pudo obtener la URL de subida");
  }

  const { uploadUrl, fileUrl } = requestRes.data;

  // 2. Upload to Storage
  // Usamos fetch nativo aquí para evitar enviar el token de autorización a S3
  // y para manejar correctamente el Content-Type del archivo
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error("No se pudo subir el archivo al almacenamiento");
  }

  // 3. Confirm Upload
  const confirmRes = await httpClient.post(`/chapters/${chapterId}/confirm-upload`, {
    fileUrl,
    type,
  });

  if (confirmRes.error) {
    throw new Error(confirmRes.error || "No se pudo confirmar la subida");
  }
};

export const chaptersApi = {
  /**
   * Create new chapter
   */
  async create(data: CreateChapterDto) {
    const response = await httpClient.post<ApiChapter>("/chapters", data);
    return {
      ...response,
      data: response.data ? mapApiChapter(response.data) : null,
    };
  },

  /**
   * Update existing chapter
   */
  async update(id: number, data: UpdateChapterDto) {
    const response = await httpClient.put<ApiChapter>(`/chapters/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiChapter(response.data) : null,
    };
  },

  /**
   * Delete chapter
   */
  async delete(id: number) {
    return httpClient.delete(`/chapters/${id}`);
  },
  
  /**
   * Get chapters by module ID
   * Assuming standard REST nesting or query param, adjusting to common patterns
   */
  async getByModule(moduleId: number) {
    const response = await httpClient.get<ApiChapter[]>(`/modules/${moduleId}/chapters`);
    return {
      ...response,
      data: response.data?.map(mapApiChapter) ?? null,
    };
  },

  /**
   * Reorder chapters within a module
   */
  async reorder(moduleId: number, chapterIds: (number | string)[]) {
    const response = await httpClient.patch(`/modules/${moduleId}/reorder`, { chapterIds });
    return response;
  }
};
