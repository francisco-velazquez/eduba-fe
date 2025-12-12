// Application configuration constants

export const APP_CONFIG = {
  name: "EduManager",
  description: "Plataforma de Gestión Educativa",
  version: "1.0.0",
  copyright: `© ${new Date().getFullYear()} EduManager. Todos los derechos reservados.`,
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  auth: {
    loginSuccess: "Sesión iniciada correctamente",
    loginError: "Error al iniciar sesión",
    signupSuccess: "Cuenta creada exitosamente",
    signupError: "Error al registrarse",
    logoutSuccess: "Sesión cerrada",
    invalidCredentials: "Credenciales inválidas. Verifica tu correo y contraseña.",
    emailAlreadyRegistered: "Este correo ya está registrado. Intenta iniciar sesión.",
  },
  crud: {
    createSuccess: (entity: string) => `${entity} creado exitosamente`,
    updateSuccess: (entity: string) => `${entity} actualizado exitosamente`,
    deleteSuccess: (entity: string) => `${entity} eliminado exitosamente`,
    createError: (entity: string) => `Error al crear ${entity}`,
    updateError: (entity: string) => `Error al actualizar ${entity}`,
    deleteError: (entity: string) => `Error al eliminar ${entity}`,
  },
} as const;

// Status labels in Spanish
export const STATUS_LABELS = {
  activo: "Activo",
  inactivo: "Inactivo",
} as const;

// Role labels in Spanish
export const ROLE_LABELS = {
  admin: "Administrador",
  maestro: "Maestro",
  alumno: "Alumno",
} as const;
