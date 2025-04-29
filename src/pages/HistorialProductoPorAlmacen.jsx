import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { getHistorialProductoPorAlmacen } from "../api/stock";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Pagination from "../components/Pagination";

export default function HistorialProductoPorAlmacen() {
  const { id_almacen, id_producto } = useParams();
  const { accessToken } = useAuth();
  const [graficoStock, setGraficoStock] = useState([]);
  const [historialTabla, setHistorialTabla] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [sku, setSku] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrafico = async () => {
      try {
        const data = await getHistorialProductoPorAlmacen(
          id_almacen,
          id_producto,
          accessToken,
          100
        );

        if (data.data.length > 0) {
          setSku(data.data[0].sku_producto);
        }

        const ordenado = [...data.data].sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        let stock = 0;
        const acumulado = ordenado.map((mov) => {
          const tipo = mov.tipo?.toLowerCase().trim();
          const cambio = tipo === "entrada" ? mov.cantidad : -mov.cantidad;
          stock += cambio;
          return {
            fecha: mov.fecha?.split("T")[0] ?? "Sin fecha",
            cantidad: stock,
          };
        });

        setGraficoStock(acumulado);
      } catch (error) {
        console.error("Error al obtener datos del gráfico:", error.message);
      }
    };

    fetchGrafico();
  }, [id_almacen, id_producto, accessToken]);

  useEffect(() => {
    const fetchTabla = async () => {
      try {
        setIsLoading(true);
        const data = await getHistorialProductoPorAlmacen(
          id_almacen,
          id_producto,
          accessToken,
          limit,
          offset
        );
        setHistorialTabla(data.data);
        setTotal(data.total);
      } catch (error) {
        console.error("Error al obtener historial:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabla();
  }, [id_almacen, id_producto, accessToken, limit, offset]);

  useEffect(() => {
    document.title = "Historial de Producto por Almacén";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {`Historial del producto ${sku} en almacén ${id_almacen}`}
        </h1>
        <button
          role="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver atrás
        </button>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Evolución de stock
          </h2>
          {graficoStock.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <LineChart width={600} height={250} data={graficoStock}>
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay datos suficientes.</p>
          )}
        </div>

        <h2 className="text-lg font-bold text-gray-700">
          Historial de movimientos
        </h2>

        <div className="bg-white shadow rounded overflow-x-auto">
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando historial...</p>
          ) : historialTabla.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay movimientos registrados.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2">ID Movimiento</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Lote</th>
                  <th className="px-4 py-2">Cantidad</th>
                  <th className="px-4 py-2">Almacén</th>
                  <th className="px-4 py-2">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historialTabla.map((h, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{h.id_movimiento}</td>
                    <td className="px-4 py-2">
                      {new Date(h.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{h.tipo}</td>
                    <td className="px-4 py-2">{h.sku_producto}</td>
                    <td className="px-4 py-2">{h.lote}</td>
                    <td className="px-4 py-2">{h.cantidad}</td>
                    <td className="px-4 py-2">{h.codigo_almacen}</td>
                    <td className="px-4 py-2">{h.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={(nuevoOffset) => setOffset(nuevoOffset)}
        />
      </div>
    </>
  );
}
