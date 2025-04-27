import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../context/useAuth";
import {
  getDetalleAlmacenes,
  getProductosPorAlmacenPieChart,
} from "../api/stock";
import HoverMessage from "../components/HoverMessage";
import { generarColores } from "../utils/other";

export default function Almacenes() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [productosAlmacen, setProductosAlmacen] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
  const [nombreAlmacenSeleccionado, setNombreAlmacenSeleccionado] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDetalleAlmacenes(accessToken);
        setAlmacenes(data);
      } catch (error) {
        console.error("Error al cargar stock por almacén:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Almacenes";
  }, []);

  const handleAlmacenClick = async (codigoAlmacen) => {
    try {
      setAlmacenSeleccionado(codigoAlmacen);
      const almacen = almacenes.find((a) => a.codigo_almacen === codigoAlmacen);
      setNombreAlmacenSeleccionado(almacen?.nombre_almacen || "");
      const productos = await getProductosPorAlmacenPieChart(
        codigoAlmacen,
        accessToken
      );
      setProductosAlmacen(productos);
    } catch (error) {
      console.error("Error al obtener productos del almacén:", error.message);
    }
  };

  const handleProductoClick = (codigoProducto) => {
    if (!almacenSeleccionado) return;
    navigate(
      `/stock/almacen/${almacenSeleccionado}/producto/${codigoProducto}`
    );
  };

  const coloresPie = generarColores(productosAlmacen.length);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Almacenes</h1>

          {/* Accesos rápidos */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg text-center font-semibold mb-4">
              Accesos rápidos
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {user?.role === "admin" && (
                <Link
                  to="/almacenes/nuevo"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  + Crear almacén
                </Link>
              )}
              <Link
                to="/almacenes/listado"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
              >
                📋 Ver listado
              </Link>
            </div>
          </div>

          {/* Gráficas en paralelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de stock por almacén */}
            <div className="relative group bg-white rounded-lg shadow p-4">
              <h2 className="text-lg text-center font-bold text-gray-700 mb-6">
                Stock total por almacén
              </h2>
              <div className="flex justify-center items-center">
                <div className="overflow-x-auto">
                  <div className="min-w-[400px]">
                    <BarChart width={350} height={200} data={almacenes}>
                      <XAxis dataKey="nombre_almacen" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="total_cantidad"
                        fill="#3b82f6"
                        onClick={(data) =>
                          handleAlmacenClick(data.codigo_almacen)
                        }
                        className="cursor-pointer"
                      />
                    </BarChart>
                  </div>
                </div>
                <HoverMessage text="Haz clic en una barra para ver los productos de ese almacén." />
              </div>
            </div>

            {/* Gráfico circular por almacén seleccionado */}
            <div className="relative group bg-white rounded-lg shadow p-4">
              <h2 className="text-lg text-center font-bold text-gray-700 mb-2">
                Productos en{" "}
                {nombreAlmacenSeleccionado ?? "(selecciona un almacén)"}
              </h2>
              <div className="flex justify-center items-center">
                <div className="overflow-x-auto">
                  <div className="min-w-[400px]">
                    <PieChart width={550} height={300}>
                      <Pie
                        data={productosAlmacen}
                        dataKey="cantidad_total"
                        nameKey="nombre_producto"
                        outerRadius={80}
                        label
                        onClick={(data) =>
                          handleProductoClick(data.codigo_producto)
                        }
                        className="cursor-pointer"
                      >
                        {productosAlmacen.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={coloresPie[index % coloresPie.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        align="right"
                        verticalAlign="middle"
                        width={200}
                      />
                      <Tooltip />
                    </PieChart>
                  </div>
                </div>
                <HoverMessage text="Haz clic en un producto para ver su stock en este almacén." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
