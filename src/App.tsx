import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Maestros from "./pages/Maestros";
import Alumnos from "./pages/Alumnos";
import Grados from "./pages/Grados";
import Asignaturas from "./pages/Asignaturas";
import Asignaciones from "./pages/Asignaciones";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
