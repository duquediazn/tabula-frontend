import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import {
  getStockProductoPorAlmacen,
  getHistorialProductoPorAlmacen,
} from "../api/stock";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Pagination from "../components/Pagination";

export default function StockProductoPorAlmacen() {
  const { codigo_almacen, codigo_producto } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreAlmacen, setNombreAlmacen] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStockProductoPorAlmacen(
          codigo_almacen,
          codigo_producto,
          accessToken,
          limit,
          offset
        );
        setStock(data.data);
        setTotal(data.total);
        if (data.data.length > 0) {
          setNombreAlmacen(data.data[0].nombre_almacen);
          setNombreProducto(data.data[0].nombre_producto);
        }

        const historial = await getHistorialProductoPorAlmacen(
          codigo_almacen,
          codigo_producto,
          accessToken
        );

        const ordenado = historial.data.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        let stockAcumulado = 0;
        const acumulado = ordenado.map((mov) => {
          const cambio = mov.tipo === "entrada" ? mov.cantidad : -mov.cantidad;
          stockAcumulado += cambio;
          return {
            fecha: mov.fecha.split("T")[0],
            cantidad: stockAcumulado,
          };
        });

        setHistorial(acumulado);
      } catch (error) {
        console.error("Error al obtener stock del producto:", error);
        alert("No se pudo cargar el stock del producto en el almacén.");
        navigate("/almacenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [codigo_almacen, codigo_producto, accessToken, navigate, limit, offset]);

  useEffect(() => {
    document.title = "Stock Producto por Almacén";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Stock de {nombreProducto} en {nombreAlmacen} (#{codigo_almacen})
          </h1>

          <button
            role="button"
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline text-sm"
          >
            ← Volver
          </button>

          {/* Gráfica historial */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Historial de stock
          </h2>
          <div className="bg-white rounded shadow p-4">
            {historial.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay movimientos registrados para este producto.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <LineChart width={600} height={300} data={historial}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cantidad" stroke="#10b981" />
                  </LineChart>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Stock actual
          </h2>
          {isLoading ? (
            <p className="text-sm text-gray-600">Cargando...</p>
          ) : stock.length === 0 ? (
            <p className="text-sm text-gray-600">
              No hay stock registrado para este producto en este almacén.
            </p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Lote</th>
                    <th className="px-4 py-3">Fecha caducidad</th>
                    <th className="px-4 py-3">Cantidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stock.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2">{item.lote}</td>
                      <td className="px-4 py-2">
                        {item.fecha_cad ? item.fecha_cad.split("T")[0] : "-"}
                      </td>
                      <td className="px-4 py-2">{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
