import { useState } from "react";
import { GraduationCap, ArrowRight, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useAuthRedirect } from "@/hooks";
import { LoadingSpinner } from "@/components/common";
import { APP_CONFIG, TOAST_MESSAGES } from "@/config";

export default function Login() {
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const { isLoading: authLoading } = useAuthRedirect({ redirectAuthenticated: true });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn({ email, password });

    if (!result.success) {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.auth.loginError,
        description: result.error?.includes("Invalid login credentials")
          ? TOAST_MESSAGES.auth.invalidCredentials
          : result.error,
      });
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signUp({ email, password, fullName });

    if (!result.success) {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.auth.signupError,
        description: result.error?.includes("already registered")
          ? TOAST_MESSAGES.auth.emailAlreadyRegistered
          : result.error,
      });
    } else {
      toast({
        title: TOAST_MESSAGES.auth.signupSuccess,
        description: "Tu cuenta ha sido creada exitosamente.",
      });
    }

    setLoading(false);
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-primary mb-3 md:mb-4">
            <GraduationCap className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{APP_CONFIG.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 text-center">
            {APP_CONFIG.description}
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl">Bienvenido</CardTitle>
            <CardDescription className="text-sm">
              Inicia sesión o crea una cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                <TabsTrigger value="login" className="text-sm">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="text-sm">
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        Ingresar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm">
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        Crear cuenta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Las cuentas nuevas se registran como alumno por defecto. Un administrador puede
                    cambiar tu rol.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4 md:mt-6">
          {APP_CONFIG.copyright}
        </p>
      </div>
    </div>
  );
}
