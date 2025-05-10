import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminRoute() {
  const { user, isLoading, isLoggingOut } = useAuth();

  if (isLoading) return null;

  if (user?.role !== "admin" && !isLoggingOut) {
    alert("Acceso denegado. No tienes permisos para acceder a esta página.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
