import { useState } from "react";
import { register as registerAPI } from "../api/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const { isAuthenticated, isLoading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await registerAPI({ nombre, email, password });
      setSuccessMsg("Registro exitoso. Espera activación del administrador.");
    } catch (error) {
      try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed.detail)) {
          // Si son múltiples errores, los concatenamos
          const mensaje = parsed.detail.map((err) => err.msg).join(". ");
          setErrorMsg(mensaje);
        } else if (typeof parsed.detail === "string") {
          setErrorMsg(parsed.detail);
        } else {
          setErrorMsg("Error al registrar usuario.");
        }
      } catch (e) {
        setErrorMsg("Error inesperado al registrar usuario.", e);
      }
    }
  };

  useEffect(() => {
    document.title = "Registro";
  }, []);

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Crear una cuenta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 bg-white text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 bg-white text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 bg-white text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            {successMsg && (
              <p className="text-green-600 text-sm">{successMsg}</p>
            )}

            <div>
              <button
                role="button"
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500"
              >
                Registrarse
              </button>
              <p className="mt-4 text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
