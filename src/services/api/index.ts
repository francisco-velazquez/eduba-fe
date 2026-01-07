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

export { teachersApi, mapApiTeacher } from "./teachers.api";
export type { ApiTeacher, CreateTeacherDto, UpdateTeacherDto, AppTeacher } from "./teachers.api";

export { studentsApi, mapApiStudent } from "./students.api";
export type { ApiStudent, CreateStudentDto, UpdateStudentDto, AppStudent } from "./students.api";
