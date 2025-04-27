import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // custom hook useAuth, que accede al contexto de autenticación

export default function PrivateRoute({ children }) {
  //Definimos el componente PrivateRoute. Recibe children, es decir, el contenido que queremos proteger
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth(); //Extraemos de nuestro contexto el estado de autenticación del usuario actual.

  if (isLoading) return null;

  // Si no está autenticado Y no está cerrando sesión → redirigimos
  if (!isAuthenticated && !isLoggingOut) {
    return <Navigate to="/login" replace />; //El replace indica que esta redirección no se guarda en el historial del navegador,
    // es decir, que si luego hace "atrás", no vuelve a la ruta protegida.
  }

  return children; //renderizamos el contenido protegido.
}
