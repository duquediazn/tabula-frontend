import Breadcrumb from "../components/Breadcrumb";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAuth } from "../context/useAuth";
import {
  getSemaforo,
  getDetalleAlmacenes,
  getProductosPorAlmacenPieChart,
  getHistorialProductoPorAlmacen,
} from "../api/stock";
import { useNavigate } from "react-router-dom";
import HoverMessage from "../components/HoverMessage";
import { generarColores } from "../utils/other";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  // Estados para los datos de los 4 gráficos
  const [semaforo, setSemaforo] = useState(null);
  const [almacenes, setAlmacenes] = useState([]);
  const [productosAlmacen, setProductosAlmacen] = useState([]);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
  const [nombreAlmacenSeleccionado, setNombreAlmacenSeleccionado] =
    useState(null);
  const [historialProducto, setHistorialProducto] = useState([]);
  const [nombreProductoSeleccionado, setNombreProductoSeleccionado] =
    useState(null);

  const fetchData = async () => {
    try {
      const [dataSemaforo, dataAlmacenes] = await Promise.all([
        getSemaforo(accessToken),
        getDetalleAlmacenes(accessToken),
      ]);
      setSemaforo(dataSemaforo);
      setAlmacenes(dataAlmacenes);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error.message);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (!accessToken) return;
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const handleAlmacenClick = async (codigoAlmacen) => {
    try {
      setAlmacenSeleccionado(codigoAlmacen);
      setNombreAlmacenSeleccionado(
        almacenes.find((a) => a.codigo_almacen === codigoAlmacen)
          ?.nombre_almacen
      );
      const productos = await getProductosPorAlmacenPieChart(
        codigoAlmacen,
        accessToken
      );
      setProductosAlmacen(productos);
    } catch (error) {
      console.error("Error al cargar productos del almacén:", error.message);
    }
  };

  const handleProductoClick = async (codigoProducto) => {
    try {
      if (!almacenSeleccionado) return;
      const historial = await getHistorialProductoPorAlmacen(
        almacenSeleccionado,
        codigoProducto,
        accessToken
      );
      setNombreProductoSeleccionado(
        productosAlmacen.find((p) => p.codigo_producto === codigoProducto)
          ?.nombre_producto
      );

      // Ordenar por fecha ascendente (si no lo está ya)
      const ordenado = historial.data.sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );

      // Acumular la cantidad a lo largo del tiempo
      let stock = 0;
      const acumulado = ordenado.map((mov) => {
        const cambio = mov.tipo === "entrada" ? mov.cantidad : -mov.cantidad;
        stock += cambio;
        return {
          fecha: mov.fecha.split("T")[0], // solo fecha
          cantidad: stock,
        };
      });

      setHistorialProducto(acumulado);
    } catch (error) {
      console.error("Error al obtener historial del producto:", error.message);
    }
  };

  //Detalle semáforo:
  const irACaducidad = (desde, hasta) => {
    navigate(`/caducidad?desde=${desde}&hasta=${hasta}`);
  };

  const coloresPie = generarColores(productosAlmacen.length);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Dashboard de Tábula
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico 1: Semáforo */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-6">
                Estado de Stock (Semáforo)
              </h2>
              <div className="flex flex-wrap justify-around items-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">
                    {semaforo?.no_caduca ?? "-"}
                  </div>
                  <p className="text-sm mt-2 text-gray-700">No caduca</p>
                </div>
                <div className="cursor-pointer hover:opacity-80 transition-opacity duration-200 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg"
                    onClick={() => irACaducidad(1, 6)}
                  >
                    {semaforo?.caduca_proximamente ?? "-"}
                  </div>
                  <p className="text-sm mt-2 text-gray-700">
                    Próximo a caducar
                  </p>
                </div>
                <div className="cursor-pointer cursor-pointer hover:opacity-80 transition-opacity duration-200 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-lg"
                    onClick={() => irACaducidad(0, 1)}
                  >
                    {semaforo?.caduca_ya ?? "-"}
                  </div>
                  <p className="text-sm mt-2 text-gray-700">Caduca ya</p>
                </div>
              </div>
            </div>

            {/* Gráfico 2: Barras por almacén */}
            <div className="relative group bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-6">
                Stock total por almacén
              </h2>
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
              {/* Mensaje informativo */}
              <HoverMessage text="Haz clic en una barra para ver los productos de ese almacén." />
            </div>

            {/* Gráfico 3: Pie productos por almacén */}
            <div className="relative group bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Productos en{" "}
                {nombreAlmacenSeleccionado ?? "(selecciona un almacén)"}
              </h2>
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
                    <Legend align="right" verticalAlign="middle" width={200} />
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
              {/* Mensaje informativo */}
              <HoverMessage text="Haz clic en un producto del gráfico para ver su histórico de stock para este almacén." />
            </div>

            {/* Gráfico 4: Línea historial de stock */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-6">
                Historial de stock de{" "}
                {nombreProductoSeleccionado
                  ? `${nombreProductoSeleccionado} en ${nombreAlmacenSeleccionado}`
                  : "(selecciona un producto)"}
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  <LineChart width={350} height={300} data={historialProducto}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cantidad" stroke="#10b981" />
                  </LineChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
