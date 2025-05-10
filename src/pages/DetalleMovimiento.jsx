import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import Pagination from "../components/Pagination";
import { getMovimientoById, getLineasMovimiento } from "../api/movimientos";

export default function DetalleMovimiento() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [totalLineas, setTotalLineas] = useState(0);

  const [movimiento, setMovimiento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovimientoCompleto = async () => {
      setIsLoading(true);
      try {
        // Ejecutamos ambas peticiones al mismo tiempo
        const [dataMovimiento, dataLineas] = await Promise.all([
          getMovimientoById(id, accessToken),
          getLineasMovimiento(id, accessToken, limit, offset),
        ]);

        setMovimiento({
          ...dataMovimiento,
          lineas: dataLineas.data || [],
        });
        setTotalLineas(dataLineas.total || 0);
      } catch (error) {
        console.error("Error al cargar el movimiento o sus líneas:", error);
        alert("Error al cargar el movimiento");
        navigate("/movimientos/listado");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovimientoCompleto();
  }, [id, accessToken, limit, offset, navigate]);

  useEffect(() => {
    document.title = "Detalle Movimiento";
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Breadcrumb />
        <div className="p-6 text-gray-700">Cargando movimiento...</div>
      </>
    );
  }

  if (!movimiento) return null;

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Detalle del movimiento #{movimiento.id_mov}
        </h1>
        <button
          role="button"
          onClick={() => navigate("/movimientos/listado")}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4"
        >
          <span className="mr-1">←</span>
          Volver al listado
        </button>

        {/* Datos generales del movimiento */}
        <div className="mb-6 text-sm text-gray-800">
          <p>
            <strong>Tipo:</strong>{" "}
            <span className="capitalize">{movimiento.tipo}</span>
          </p>
          <p>
            <strong>Usuario:</strong> {movimiento.nombre_usuario}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(movimiento.fecha).toLocaleDateString()}
          </p>
          <p>
            <strong>Nº de líneas:</strong> {movimiento.lineas.length}
          </p>
        </div>

        {/* Tabla de líneas */}
        <div className="overflow-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Almacén</th>
                <th className="px-4 py-2">Lote</th>
                <th className="px-4 py-2">Caducidad</th>
                <th className="px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movimiento.lineas.map((linea) => (
                <tr key={linea.id_linea}>
                  <td className="px-4 py-2">{linea.id_linea}</td>
                  <td className="px-4 py-2">{linea.nombre_producto}</td>
                  <td className="px-4 py-2">{linea.nombre_almacen}</td>
                  <td className="px-4 py-2">{linea.lote}</td>
                  <td className="px-4 py-2">
                    {linea.fecha_cad
                      ? new Date(linea.fecha_cad).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{linea.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          total={totalLineas}
          limit={limit}
          offset={offset}
          onPageChange={(nuevoOffset) => setOffset(nuevoOffset)}
        />
      </div>
    </>
  );
}
