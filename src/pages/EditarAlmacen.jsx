import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/useAuth";
import { getAlmacenById, actualizarAlmacen } from "../api/almacenes";

export default function EditarAlmacen() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [formulario, setFormulario] = useState({
    descripcion: "",
    activo: true,
  });
  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlmacen = async () => {
      try {
        const almacen = await getAlmacenById(codigo, accessToken);
        setFormulario({
          descripcion: almacen.descripcion,
          activo: almacen.activo,
        });
      } catch (error) {
        console.error("Error al cargar almacén:", error);
        alert("No se pudo cargar el almacén");
        navigate("/almacenes/listado");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlmacen();
  }, [codigo, accessToken, navigate]);

  useEffect(() => {
    document.title = "Editar Almacén";
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
    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await actualizarAlmacen(codigo, formulario, accessToken);
      alert("Almacén actualizado correctamente");
      navigate(`/almacenes/${codigo}`);
    } catch (error) {
      console.error("Error al actualizar almacén:", error);
      alert(error.message || "Error al actualizar el almacén");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Breadcrumb />
        <div className="p-6 text-gray-700">Cargando almacén...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar almacén</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <input
                id="descripcion"
                type="text"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.descripcion} />
            </div>

            {user?.role === "admin" && (
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
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => navigate(`/almacenes/listado`)}
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
