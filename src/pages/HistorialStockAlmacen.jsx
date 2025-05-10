import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { getHistorialAlmacen } from "../api/stock";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Pagination from "../components/Pagination";

export default function HistorialStockAlmacen() {
  const { codigo_almacen } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [nombreAlmacen, setNombreAlmacen] = useState("");
  const [graficoStock, setGraficoStock] = useState([]);
  const [tablaHistorial, setTablaHistorial] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Datos para gráfica (solo 1 vez)
  useEffect(() => {
    const fetchGrafico = async () => {
      try {
        const result = await getHistorialAlmacen(
          codigo_almacen,
          accessToken,
          100
        );
        const data = result.data;

        if (data.length > 0) {
          setNombreAlmacen(data[0].nombre_almacen || "");
        }

        const ordenado = [...data].sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        let stock = 0;
        const acumulado = ordenado.map((mov) => {
          const cambio = mov.tipo === "entrada" ? mov.cantidad : -mov.cantidad;
          stock += cambio;
          return {
            fecha: mov.fecha.split("T")[0],
            cantidad: stock,
          };
        });

        setGraficoStock(acumulado);
      } catch (error) {
        console.error("Error al cargar gráfica:", error);
      }
    };

    fetchGrafico();
  }, [codigo_almacen, accessToken]);

  // Datos para tabla (con paginación)
  useEffect(() => {
    const fetchTabla = async () => {
      try {
        setIsLoading(true);
        const result = await getHistorialAlmacen(
          codigo_almacen,
          accessToken,
          limit,
          offset
        );
        setTablaHistorial(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error("Error al cargar historial:", error);
        alert("No se pudo cargar el historial de este almacén.");
        navigate("/almacenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabla();
  }, [codigo_almacen, accessToken, limit, offset, navigate]);

  useEffect(() => {
    document.title = "Historial de Stock en Almacén";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Historial de stock en {nombreAlmacen} (#{codigo_almacen})
          </h1>

          <button
            role="button"
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline text-sm"
          >
            ← Volver
          </button>

          {/* Gráfico */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Evolución de stock
            </h2>
            {graficoStock.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <LineChart width={600} height={300} data={graficoStock}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cantidad" stroke="#3b82f6" />
                  </LineChart>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No hay datos suficientes para el gráfico.
              </p>
            )}
          </div>

          {/* Tabla */}
          <h2 className="text-lg font-semibold text-gray-700">
            Historial de movimientos
          </h2>

          <div className="bg-white shadow rounded overflow-x-auto">
            {isLoading ? (
              <p className="text-sm text-gray-500">Cargando historial...</p>
            ) : tablaHistorial.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay movimientos registrados.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                  <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2">ID Movimiento</th>
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Tipo</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Lote</th>
                      <th className="px-4 py-2">Cantidad</th>
                      <th className="px-4 py-2">Producto</th>
                      <th className="px-4 py-2">Usuario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tablaHistorial.map((h, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{h.id_movimiento}</td>
                        <td className="px-4 py-2">
                          {new Date(h.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 capitalize">{h.tipo}</td>
                        <td className="px-4 py-2">{h.sku_producto}</td>
                        <td className="px-4 py-2">{h.lote}</td>
                        <td className="px-4 py-2">{h.cantidad}</td>
                        <td className="px-4 py-2">{h.codigo_producto}</td>
                        <td className="px-4 py-2">{h.usuario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      </div>
    </>
  );
}
