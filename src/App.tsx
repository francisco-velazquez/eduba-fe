import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TeacherLayout } from "@/components/layout/TeacherLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
// Admin pages
import Dashboard from "./pages/Dashboard";
import Maestros from "./pages/Maestros";
import Alumnos from "./pages/Alumnos";
import Grados from "./pages/Grados";
import Asignaturas from "./pages/Asignaturas";
import Asignaciones from "./pages/Asignaciones";
// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";
import TeacherContent from "./pages/teacher/TeacherContent";
import TeacherExams from "./pages/teacher/TeacherExams";
// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCourseViewer from "./pages/student/StudentCourseViewer";
import StudentExams from "./pages/student/StudentExams";
import StudentGrades from "./pages/student/StudentGrades";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/maestros"
            element={
              <AdminLayout>
                <Maestros />
              </AdminLayout>
            }
          />
          <Route
            path="/alumnos"
            element={
              <AdminLayout>
                <Alumnos />
              </AdminLayout>
            }
          />
          <Route
            path="/grados"
            element={
              <AdminLayout>
                <Grados />
              </AdminLayout>
            }
          />
          <Route
            path="/asignaturas"
            element={
              <AdminLayout>
                <Asignaturas />
              </AdminLayout>
            }
          />
          <Route
            path="/asignaciones"
            element={
              <AdminLayout>
                <Asignaciones />
              </AdminLayout>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/maestro"
            element={
              <TeacherLayout>
                <TeacherDashboard />
              </TeacherLayout>
            }
          />
          <Route
            path="/maestro/asignaturas"
            element={
              <TeacherLayout>
                <TeacherSubjects />
              </TeacherLayout>
            }
          />
          <Route
            path="/maestro/contenido"
            element={
              <TeacherLayout>
                <TeacherContent />
              </TeacherLayout>
            }
          />
          <Route
            path="/maestro/examenes"
            element={
              <TeacherLayout>
                <TeacherExams />
              </TeacherLayout>
            }
          />

          {/* Student Routes */}
          <Route
            path="/alumno"
            element={
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            }
          />
          <Route
            path="/alumno/cursos"
            element={
              <StudentLayout>
                <StudentCourses />
              </StudentLayout>
            }
          />
          <Route
            path="/alumno/curso/:id"
            element={<StudentCourseViewer />}
          />
          <Route
            path="/alumno/examenes"
            element={
              <StudentLayout>
                <StudentExams />
              </StudentLayout>
            }
          />
          <Route
            path="/alumno/calificaciones"
            element={
              <StudentLayout>
                <StudentGrades />
              </StudentLayout>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
