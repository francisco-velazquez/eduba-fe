import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Users, ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserRole = "maestro" | "alumno" | null;

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "maestro") {
      navigate("/maestro");
    } else if (selectedRole === "alumno") {
      navigate("/alumno");
    }
  };

  const roles = [
    {
      id: "maestro" as const,
      title: "Soy Maestro",
      description: "Accede a tus asignaturas, gestiona contenido y crea exámenes",
      icon: BookOpen,
      color: "emerald",
    },
    {
      id: "alumno" as const,
      title: "Soy Alumno",
      description: "Visualiza tus cursos, estudia el material y presenta exámenes",
      icon: Users,
      color: "violet",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">EduManager</h1>
          <p className="text-muted-foreground mt-1">Plataforma de Gestión Educativa</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Selecciona tu rol y accede a tu panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedRole === role.id
                      ? role.color === "emerald"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-violet-500 bg-violet-500/10"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${
                      role.color === "emerald"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-violet-500/20 text-violet-500"
                    }`}
                  >
                    <role.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{role.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {role.description}
                  </p>
                  {selectedRole === role.id && (
                    <div
                      className={`absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center ${
                        role.color === "emerald" ? "bg-emerald-500" : "bg-violet-500"
                      }`}
                    >
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                  />
                  <span className="text-muted-foreground">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedRole}
              >
                Ingresar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Admin Link */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                ¿Eres administrador?{" "}
                <button
                  onClick={() => navigate("/admin")}
                  className="text-primary hover:underline font-medium"
                >
                  Accede al panel de administración
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 EduManager. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
