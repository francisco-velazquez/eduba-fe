// Entity Types for the LMS

export type EntityStatus = "activo" | "inactivo";

// Base entity with common fields
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

// Student (Alumno)
export interface Student extends BaseEntity {
  nombre: string;
  apellido?: string;
  email: string;
  grado: string;
  matricula: string;
  estado: EntityStatus;
}

// Teacher (Maestro)
export interface Teacher extends BaseEntity {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  estado: EntityStatus;
  asignaturasCount?: number;
}

// Grade (Grado)
export interface Grade extends BaseEntity {
  nombre: string;
  nivel: string;
  descripcion?: string;
  alumnosCount?: number;
  asignaturasCount?: number;
}

// Subject (Asignatura)
export interface Subject extends BaseEntity {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  gradoId?: string;
  maestroId?: string;
  color?: string;
}

// Module (Módulo)
export interface Module extends BaseEntity {
  nombre: string;
  descripcion?: string;
  asignaturaId: string;
  orden: number;
  capitulos?: Chapter[];
}

// Chapter (Capítulo)
export interface Chapter extends BaseEntity {
  nombre: string;
  descripcion?: string;
  moduloId: string;
  orden: number;
  recursos?: Resource[];
}

// Resource (Recurso)
export type ResourceType = "video" | "pdf" | "presentacion" | "documento" | "enlace";

export interface Resource extends BaseEntity {
  nombre: string;
  tipo: ResourceType;
  url: string;
  capituloId: string;
  duracion?: number; // in minutes for videos
}

// Exam (Examen)
export interface Exam extends BaseEntity {
  titulo: string;
  descripcion?: string;
  asignaturaId: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracionMinutos?: number;
  preguntas?: Question[];
}

// Question (Pregunta)
export type QuestionType = "opcion_multiple" | "verdadero_falso" | "respuesta_corta";

export interface Question extends BaseEntity {
  texto: string;
  tipo: QuestionType;
  opciones?: string[];
  respuestaCorrecta: string | number;
  puntos: number;
}
