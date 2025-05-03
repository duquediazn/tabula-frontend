import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // custom hook useAuth, que accede al contexto de autenticación

export default function PrivateRoute() {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();

  if (isLoading) return null;

  // Si no está autenticado Y no está cerrando sesión → redirigimos
  if (!isAuthenticated && !isLoggingOut) {
    return <Navigate to="/login" replace />; //El replace indica que esta redirección no se guarda en el historial del navegador,
    // es decir, que si luego hace "atrás", no vuelve a la ruta protegida.
  }

  return <Outlet />; //renderizamos el contenido protegido.
}
