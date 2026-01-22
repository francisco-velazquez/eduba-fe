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

export { assignmentsApi } from "./assignments.api";
export type { AssignSubjectsDto, UpdateStudentGradeDto, GradeSubjectResponse } from "./assignments.api";

export { chaptersApi, mapApiChapter } from "./chapters.api";
export type { ApiChapter, CreateChapterDto, UpdateChapterDto, AppChapter } from "./chapters.api";

export { studentSubjectsApi, mapApiStudentSubjects, getCourseColor } from "./student-subjects.api";
export type {
  ApiStudentGrade,
  ApiSubjectModule,
  ApiStudentSubject,
  ApiStudentSubjectsResponse,
  AppStudentCourse,
  AppStudentSubjectsData,
} from "./student-subjects.api";

export { progressApi } from "./progress.api";
export type { ApiSubjectProgress, SubjectProgress } from "./progress.api";

export { examsApi, mapApiExam, mapApiExamQuestion, mapApiExamOption } from "./exams.api";
export type {
  ApiExam,
  ApiExamQuestion,
  ApiExamOption,
  AppExam,
  AppExamQuestion,
  AppExamOption,
  CreateExamDto,
  CreateExamQuestionDto,
  CreateExamOptionDto,
  UpdateExamDto,
  SubmitExamDto,
  ExamAnswerDto,
  ExamResultResponse,
  StudentExamResult,
} from "./exams.api";
