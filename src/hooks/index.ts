// Central export for all hooks
export { useAuth, AuthProvider } from "./useAuth";
export { useAuthRedirect } from "./useAuthRedirect";
export { useToast } from "./use-toast";
export { useIsMobile } from "./use-mobile";
export { useGrades, useGrade, useCreateGrade, useUpdateGrade, useDeleteGrade } from "./useGrades";
export { useSubjects, useSubject, useCreateSubject, useUpdateSubject, useDeleteSubject } from "./useSubjects";
export { useTeachers, useTeacher, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from "./useTeachers";
export { useStudents, useStudent, useCreateStudent, useUpdateStudent, useDeleteStudent } from "./useStudents";
export { useGradeSubjects, useAssignSubjectsToTeacher, useUpdateStudentGrade } from "./useAssignments";
export { useStudentCourses } from "./useStudentCourses";
export { useCourseDetails } from "./useCourseDetails";
export { useSubjectProgress, useCoursesProgress, useCompleteChapter } from "./useProgress";
