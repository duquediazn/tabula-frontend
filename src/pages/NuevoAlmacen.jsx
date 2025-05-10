import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import ErrorMessage from "../components/ErrorMessage";
import { crearAlmacen } from "../api/almacenes";
import { useEffect } from "react";

export default function NuevoAlmacen() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validar = () => {
    const nuevosErrores = {};
    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setIsSubmitting(true);

    try {
      await crearAlmacen({ descripcion }, accessToken);
      alert("Almacén creado correctamente");
      navigate("/almacenes/listado");
    } catch (error) {
      alert(error.message || "Error al crear el almacén");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.title = "Nuevo Almacén";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Nuevo almacén</h1>

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
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full h-[36px] bg-white rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.descripcion} />
            </div>

            <div className="flex gap-3">
              <button
                role="button"
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Guardar almacén
              </button>
              <button
                role="button"
                type="button"
                onClick={() => navigate("/almacenes/listado")}
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
