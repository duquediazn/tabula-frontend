import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI, getPerfil } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api/config";

//Crear contexto de autenticación
export const AuthContext = createContext();

//Provider
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null); //el token JWT de acceso (no incluye el refresh token, que va en cookie).
  const [user, setUser] = useState(null); //datos del usuario autenticado (nombre, email, rol…).
  const [isLoading, setIsLoading] = useState(true); //se pone a false cuando termina de verificar si el usuario está logueado.
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false); //permite prevenir acciones mientras se cierra sesión.

  //Refresco automático del token
  let refreshTimeout;

  const getTokenExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return null;

      const expTime = decoded.exp * 1000; // en milisegundos
      const currentTime = Date.now();
      const timeLeft = expTime - currentTime;

      return timeLeft; // tiempo restante en ms
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      return null;
    }
  };

  const scheduleTokenRefresh = (token) => {
    clearTimeout(refreshTimeout); // Limpiamos si había uno pendiente
    const expiresInMs = getTokenExpiration(token);
    const refreshTime = expiresInMs - 5 * 60 * 1000; // 5 minutos antes
    if (refreshTime > 0) {
      refreshTimeout = setTimeout(refreshAccessToken, refreshTime);
    }
  };

  const refreshAccessToken = async () => {
    /*Llama al backend (/auth/refresh) que usa la cookie HttpOnly para generar un nuevo access token.*/
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al refrescar el token");

      const data = await response.json();
      setAccessToken(data.access_token);
      scheduleTokenRefresh(data.access_token);

      const userData = await getPerfil(data.access_token);
      setUser({
        id: userData.id,
        role: userData.rol,
        name: userData.nombre,
        email: userData.email,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("No se pudo refrescar el token:", error);
      setAccessToken(null);
      setUser(null);
      clearTimeout(refreshTimeout);
      setIsLoading(false);
    }
  };

  //Login
  const login = async (email, password) => {
    const data = await loginAPI({ email, password });
    setAccessToken(data.access_token);
    scheduleTokenRefresh(data.access_token);

    const userData = await getPerfil(data.access_token);
    setUser({
      id: userData.id,
      role: userData.rol,
      name: userData.nombre,
      email: userData.email,
    });

    navigate("/dashboard");
    localStorage.setItem("login-event", Date.now()); //disparar evento login
  };

  //Logout
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      // Llamada al backend para eliminar la cookie
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Necesario para enviar la cookie
      });
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
    }

    // Limpieza local de sesión
    localStorage.setItem("logout-event", Date.now()); //disparar evento logout
    setAccessToken(null);
    setUser(null);
    clearTimeout(refreshTimeout);
    navigate("/login");
  };

  useEffect(() => {
    refreshAccessToken();
  }, []); //se ejecuta una sola vez al cargar la app

  /*Sincronización de login/logout entre pestañas:
  Porque el AuthContext vive dentro de cada pestaña, si el usuario cierra sesión en una, 
  las otras no "se enteran" a menos que se sincronicen manualmente.*/

  useEffect(() => {
    const syncLogout = (event) => {
      //Cierra la sesión en todas las pestañas
      if (event.key === "logout-event") {
        setAccessToken(null);
        setUser(null);
        clearTimeout(refreshTimeout);
        navigate("/login");
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  useEffect(() => {
    const syncLogin = (event) => {
      //sincroniza acceso tras login en otra pestaña
      if (event.key === "login-event") {
        refreshAccessToken(); // actualiza token y datos del usuario
      }
    };

    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  /*
  Cualquier componente envuelto dentro del AuthProvider podrá usar estos valores.
  isAuthenticated es true si hay un token, false si no.
  */

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        login,
        logout,
        isLoading,
        isLoggingOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
