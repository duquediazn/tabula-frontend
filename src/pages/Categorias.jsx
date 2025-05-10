import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ErrorMessage from "../components/ErrorMessage";
import {
  getCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} from "../api/productos";

export default function Categorias() {
  const { accessToken } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [nombreNueva, setNombreNueva] = useState("");
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarCategorias = async () => {
    try {
      const data = await getCategorias(accessToken);
      setCategorias(data);
    } catch (e) {
      console.error("Error al cargar categorías:", e);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Categorías";
  }, []);

  const handleCrear = async () => {
    if (!nombreNueva.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    try {
      const nueva = await crearCategoria(nombreNueva.trim(), accessToken);
      setCategorias((prev) => [...prev, nueva]);
      setNombreNueva("");
      setError("");
      mostrarMensaje("Categoría creada correctamente");
    } catch (e) {
      setError(e.message || "Error al crear categoría");
    }
  };

  const handleEditar = async (id) => {
    if (!nuevoNombre.trim()) return;
    try {
      const actualizada = await editarCategoria(
        id,
        nuevoNombre.trim(),
        accessToken
      );
      setCategorias((prev) => prev.map((c) => (c.id === id ? actualizada : c)));
      setEditandoId(null);
      setNuevoNombre("");
      mostrarMensaje("Categoría actualizada");
    } catch (e) {
      alert(e.message || "No se pudo editar");
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta categoría?"
    );
    if (!confirmar) return;
    try {
      await eliminarCategoria(id, accessToken);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      mostrarMensaje("Categoría eliminada");
    } catch (e) {
      alert(e.message || "No se pudo eliminar la categoría");
    }
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000); // se oculta después de 3 segundos
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestionar categorías
        </h1>
        <button
          role="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver atrás
        </button>
        {mensaje && (
          <div className="text-sm text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">
            {mensaje}
          </div>
        )}

        {/* Crear nueva */}
        <div>
          <label
            htmlFor={`input${nombreNueva}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nueva categoría
          </label>
          <div className="flex gap-2">
            <input
              id={`input${nombreNueva}`}
              type="text"
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              placeholder="Nombre"
              className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              role="button"
              onClick={handleCrear}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-sm"
            >
              Crear
            </button>
          </div>
          <ErrorMessage message={error} />
        </div>

        {/* Lista */}
        <div className="bg-white shadow rounded divide-y divide-gray-200">
          {categorias.map((cat) => (
            <div key={cat.id} className="p-3 flex justify-between items-center">
              {editandoId === cat.id ? (
                <>
                  <input
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="flex gap-2 ml-2">
                    <button
                      role="button"
                      onClick={() => handleEditar(cat.id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      role="button"
                      onClick={() => {
                        setEditandoId(null);
                        setNuevoNombre("");
                      }}
                      className="text-gray-500 hover:underline text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm">{cat.nombre}</span>
                  <div className="flex gap-2">
                    <button
                      role="button"
                      onClick={() => {
                        setEditandoId(cat.id);
                        setNuevoNombre(cat.nombre);
                      }}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      role="button"
                      onClick={() => handleEliminar(cat.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
