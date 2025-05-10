//Permite acceder fácilmente al contexto de autenticación (AuthContext) desde cualquier componente de la app
import { useContext } from "react"; //Importa el hook useContext de React.
import { AuthContext } from "./AuthProvider"; //Importa el contexto AuthContext, creado en AuthProvider.jsx

export function useAuth() {
  /*Esta función devuelve el valor actual del contexto AuthContext.
   Evita repetir useContext(AuthContext) en todos los componentes.
  */
  return useContext(AuthContext);
}
