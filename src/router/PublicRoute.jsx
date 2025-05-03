import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

/*
Outlet es el marcador de posición que le dice a React Router:
“Aquí van las rutas hijas definidas dentro de mí”.
*/
