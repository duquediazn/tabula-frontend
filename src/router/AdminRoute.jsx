import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, isLoading, isLoggingOut } = useAuth();

  if (isLoading) return null;

  // No alertamos si estamos cerrando sesión
  if (!isLoggingOut && (!user || user.role !== "admin")) {
    alert("Acceso denegado. Solo los administradores pueden acceder.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
