/**
 * API Services barrel export
 */

export { httpClient, HttpClient } from "./http-client";
export { authApi, mapApiRoleToAppRole } from "./auth.api";
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiUser,
  AppRoleMapping 
} from "./auth.api";

export { gradesApi, mapApiGrade } from "./grades.api";
export type { ApiGrade, CreateGradeDto, UpdateGradeDto, AppGrade } from "./grades.api";

export { subjectsApi, mapApiSubject } from "./subjects.api";
export type { ApiSubject, CreateSubjectDto, UpdateSubjectDto, AppSubject } from "./subjects.api";
