import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { getAlmacenById } from "../api/almacenes";

export default function DetalleAlmacen() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [almacen, setAlmacen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlmacen = async () => {
      try {
        const data = await getAlmacenById(codigo, accessToken);
        setAlmacen(data);
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
    document.title = "Detalle Almacén";
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Breadcrumb />
        <div className="p-6 text-gray-700">Cargando almacén...</div>
      </>
    );
  }

  if (!almacen) return null;

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Detalle del almacén
          </h1>
          <button
            role="button"
            onClick={() => navigate(`/almacenes/listado`)}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Volver al listado
          </button>

          <div className="bg-white shadow rounded p-4 text-sm text-gray-700 space-y-2">
            <p>
              <strong>Código:</strong> {almacen.codigo}
            </p>
            <p>
              <strong>Descripción:</strong> {almacen.descripcion}
            </p>
            <p>
              <strong>Estado:</strong> {almacen.activo ? "Activo" : "Inactivo"}
            </p>
          </div>

          {user?.role === "admin" && (
            <div className="flex gap-4 pt-4">
              <button
                role="button"
                onClick={() => navigate(`/almacenes/${almacen.codigo}/editar`)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
              >
                Editar almacén
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
