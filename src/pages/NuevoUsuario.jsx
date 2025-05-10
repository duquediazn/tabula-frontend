import { useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { crearUsuario } from "../api/users";
import { useEffect } from "react";

export default function NuevoUsuario() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    passwd: "",
    rol: "usuario",
    activo: true,
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre.trim())
      nuevosErrores.nombre = "El nombre es obligatorio";
    if (!formulario.email.trim())
      nuevosErrores.email = "El email es obligatorio";
    if (!formulario.passwd.trim())
      nuevosErrores.passwd = "La contraseña es obligatoria";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await crearUsuario(formulario, accessToken);
      alert("Usuario creado correctamente");
      navigate("/usuarios");
    } catch (error) {
      console.error(error);
      alert("Error al crear usuario:\n" + error.message);
    }
  };

  useEffect(() => {
    document.title = "Nuevo Usuario";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Nuevo usuario</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.nombre} />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.email} />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="contraseña"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="contraseña"
                type="password"
                name="passwd"
                value={formulario.passwd}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.passwd} />
            </div>

            {/* Rol */}
            <div>
              <label
                htmlFor="rol"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                value={formulario.rol}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Activo */}
            <div className="flex items-center gap-2">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formulario.activo}
                onChange={handleChange}
              />
              <label htmlFor="activo" className="text-sm text-gray-700">
                Activo
              </label>
            </div>

            <div className="flex gap-3">
              <button
                role="button"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Crear usuario
              </button>
              <button
                role="button"
                type="button"
                onClick={() => navigate("/usuarios")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
