/**
 * Exams API Service
 * Handles all exam-related API calls
 */

import { httpClient } from "./http-client";

// ==================== API Types ====================

export interface ApiExamOption {
  id: number;
  optionText: string;
  isCorrect?: boolean; // Only present for teachers
}

export interface ApiExamQuestion {
  id: number;
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: ApiExamOption[];
}

export interface ApiExam {
  id: number;
  title: string;
  moduleId: number;
  questions: ApiExamQuestion[];
}

// ==================== Create/Update DTOs ====================

export interface CreateExamOptionDto {
  optionText: string;
  isCorrect: boolean;
}

export interface CreateExamQuestionDto {
  questionText: string;
  questionType: "multiple_choice" | "true_false";
  options: CreateExamOptionDto[];
}

export interface CreateExamDto {
  title: string;
  moduleId: number;
  questions: CreateExamQuestionDto[];
}

export interface UpdateExamDto {
  title?: string;
  questions?: CreateExamQuestionDto[];
}

// ==================== Submit Exam DTOs ====================

export interface ExamAnswerDto {
  questionId: number;
  optionId: number;
}

export interface SubmitExamDto {
  answers: ExamAnswerDto[];
}

export interface ExamResultResponse {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
}

// ==================== Student Exam Response ====================

export interface StudentExamResult {
  id: number;
  score: number;
  passed: boolean;
  submittedAt: string;
  exam: {
    id: number;
    title: string;
    moduleId: number;
  };
}

// ==================== App Types (mapped) ====================

export interface AppExamOption {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface AppExamQuestion {
  id: number;
  text: string;
  type: "multiple_choice" | "true_false";
  options: AppExamOption[];
}

export interface AppExam {
  id: number;
  title: string;
  moduleId: number;
  questions: AppExamQuestion[];
  questionsCount: number;
}

// ==================== Mappers ====================

export function mapApiExamOption(option: ApiExamOption): AppExamOption {
  return {
    id: option.id,
    text: option.optionText,
    isCorrect: option.isCorrect,
  };
}

export function mapApiExamQuestion(question: ApiExamQuestion): AppExamQuestion {
  return {
    id: question.id,
    text: question.questionText,
    type: question.questionType,
    options: question.options.map(mapApiExamOption),
  };
}

export function mapApiExam(exam: ApiExam): AppExam {
  return {
    id: exam.id,
    title: exam.title,
    moduleId: exam.moduleId,
    questions: exam.questions.map(mapApiExamQuestion),
    questionsCount: exam.questions.length,
  };
}

// ==================== API Service ====================

export const examsApi = {
  /**
   * Get all exams (for teachers)
   */
  async getAll() {
    const response = await httpClient.get<ApiExam[]>("/exams");
    return {
      ...response,
      data: response.data?.map(mapApiExam) ?? [],
    };
  },

  /**
   * Get exam by ID
   */
  async getById(id: number) {
    const response = await httpClient.get<ApiExam>(`/exams/${id}`);
    return {
      ...response,
      data: response.data ? mapApiExam(response.data) : null,
    };
  },

  /**
   * Get exam by module ID
   */
  async getByModuleId(moduleId: number) {
    const response = await httpClient.get<ApiExam>(`/exams/by-module/${moduleId}`);
    return {
      ...response,
      data: response.data ? mapApiExam(response.data) : null,
    };
  },

  /**
   * Get exam by module ID
   */
  async getBySubjectId(subjectId: number) {
    const response = await httpClient.get<ApiExam[]>(`/exams/by-subject/${subjectId}`);

    const mappedExams = response.data?.map(mapApiExam) ?? [];

    return {
      ...response,
      data: response.data ? mappedExams : null,
    };
  },

  /**
   * Create new exam (teacher only)
   */
  async create(data: CreateExamDto) {
    const response = await httpClient.post<ApiExam>("/exams", data);
    return {
      ...response,
      data: response.data ? mapApiExam(response.data) : null,
    };
  },

  /**
   * Update exam (teacher only)
   */
  async update(id: number, data: UpdateExamDto) {
    const response = await httpClient.put<ApiExam>(`/exams/${id}`, data);
    return {
      ...response,
      data: response.data ? mapApiExam(response.data) : null,
    };
  },

  /**
   * Delete exam (teacher only)
   */
  async delete(id: number) {
    return httpClient.delete(`/exams/${id}`);
  },

  /**
   * Submit exam answers (student only)
   */
  async submit(examId: number, data: SubmitExamDto) {
    const response = await httpClient.post<ExamResultResponse>(
      `/exams/${examId}/submit`,
      data
    );
    return response;
  },

  /**
   * Get student exam results
   */
  async getStudentResults() {
    const response = await httpClient.get<StudentExamResult[]>("/exams/results/me");
    return response;
  },

  /**
   * Get available exams for student
   */
  async getAvailableForStudent() {
    const response = await httpClient.get<ApiExam[]>("/exams/available");
    return {
      ...response,
      data: response.data?.map(mapApiExam) ?? [],
    };
  },
};
