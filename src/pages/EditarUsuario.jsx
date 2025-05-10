import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/useAuth";
import { getUserById, updateUser, eliminarUsuario } from "../api/users";

export default function EditarUsuario() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
    activo: true,
    password: "",
  });

  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await getUserById(id, accessToken);
        setFormulario({
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          activo: data.activo,
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        alert("No se pudo cargar el usuario");
        navigate("/usuarios");
      } finally {
        setIsLoading(false);
      }
    };

    cargarUsuario();
  }, [id, accessToken, navigate]);

  useEffect(() => {
    document.title = "Editar Usuario";
  }, []);

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
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await updateUser(id, accessToken, formulario);
      alert("Usuario actualizado correctamente");
      navigate("/usuarios");
    } catch (error) {
      alert("Error al actualizar usuario:\n" + error.message);
    }
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );
    if (!confirmar) return;

    try {
      await eliminarUsuario(id, accessToken);
      alert("Usuario eliminado correctamente");
      navigate("/usuarios");
    } catch (error) {
      alert("Error al eliminar usuario:\n" + error.message);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Breadcrumb />
        <div className="p-6 text-gray-700">Cargando usuario...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar usuario</h1>

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

            {/* Nueva contraseña */}
            <div>
              <label
                htmlFor="nueva-contraseña"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nueva contraseña
              </label>
              <input
                id="nueva-contraseña"
                type="password"
                name="password"
                value={formulario.password}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Dejar vacío para no cambiar"
              />
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
            <div htmlFor="activo" className="flex items-center gap-2">
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
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => navigate("/usuarios")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>

          <button
            onClick={handleEliminar}
            className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Eliminar usuario
          </button>
        </div>
      </div>
    </>
  );
}
