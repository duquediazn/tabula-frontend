//Permite acceder fácilmente al contexto de autenticación (AuthContext) desde cualquier componente de la app
import { useContext } from "react"; //Importa el hook useContext de React.
import { AuthContext } from "./AuthProvider"; //Importa el contexto AuthContext, creado en AuthProvider.jsx

export function useAuth() {
  return useContext(AuthContext);
}
/*
Esta función devuelve el valor actual del contexto AuthContext.

¿Por qué es útil hacer esto así?
- Evita repetir useContext(AuthContext) en todos los componentes.
- Permite centralizar lógica adicional (por ejemplo, transformar datos antes de devolverlos).
- Hace que el código sea más limpio y fácil de mantener.
*/