import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { getStockPorCategoria, getProductosPorCategoria } from "../api/stock";
import { useAuth } from "../context/useAuth";
import { generarColores } from "../utils/other";
import HoverMessage from "../components/HoverMessage";

export default function Productos() {
  const [datosCategorias, setDatosCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productosEnCategoria, setProductosEnCategoria] = useState([]);
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getStockPorCategoria(accessToken);
        setDatosCategorias(datos);
      } catch (err) {
        console.error("Error al obtener stock por categoría:", err.message);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Productos";
  }, []);

  const irACaducidad = () => {
    navigate("/caducidad?desde=0&hasta=6");
  };

  const coloresCategorias = generarColores(datosCategorias.length);
  const coloresProductos = generarColores(productosEnCategoria.length);

  const handleCategoriaClick = async (categoria) => {
    try {
      setCategoriaSeleccionada(categoria);
      const productos = await getProductosPorCategoria(
        categoria.id_categoria,
        accessToken
      );
      setProductosEnCategoria(productos);
    } catch (error) {
      console.error(
        "Error al cargar productos de la categoría:",
        error.message
      );
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Productos</h1>

          {/* Accesos rápidos */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg text-center font-semibold mb-4">
              Accesos rápidos
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {user?.role === "admin" && (
                <Link
                  to="/productos/nuevo"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  + Crear producto
                </Link>
              )}
              <Link
                to="/productos/listado"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
              >
                📋 Ver listado
              </Link>
              <button
                role="button"
                onClick={irACaducidad}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
              >
                🧪 Por caducidad
              </button>
            </div>
          </div>

          {/* Gráficas en paralelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarta: Stock por categoría */}
            <div className="relative group bg-white rounded-lg shadow p-4">
              <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                Stock total por categoría
              </h2>
              <div className="flex justify-center items-center">
                {datosCategorias.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="min-w-[400px]">
                      <PieChart width={550} height={250}>
                        <Pie
                          data={datosCategorias}
                          dataKey="cantidad_total"
                          nameKey="nombre_categoria"
                          outerRadius={80}
                          label
                          onClick={(data) => handleCategoriaClick(data)}
                          className="cursor-pointer"
                        >
                          {datosCategorias.map((_, index) => (
                            <Cell
                              key={index}
                              fill={
                                coloresCategorias[
                                index % coloresCategorias.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          align="right"
                          verticalAlign="middle"
                          width={200}
                        />
                      </PieChart>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Cargando datos...</p>
                )}
              </div>
              {/* Mensaje informativo */}
              <HoverMessage text="Haz clic en una categoría para ver todos sus productos." />
            </div>

            {/* Tarta: Productos en categoría seleccionada */}
            {categoriaSeleccionada && (
              <div className="relative group bg-white rounded-lg shadow p-4">
                <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                  Productos en {categoriaSeleccionada.nombre_categoria}
                </h2>
                <div className="flex justify-center items-center">
                  {productosEnCategoria.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div className="min-w-[400px]">
                        <PieChart width={550} height={250}>
                          <Pie
                            data={productosEnCategoria}
                            dataKey="cantidad_total"
                            nameKey="nombre_producto"
                            outerRadius={80}
                            label
                            onClick={(data) =>
                              navigate(`/productos/${data.codigo_producto}`)
                            }
                            className="cursor-pointer"
                          >
                            {productosEnCategoria.map((_, index) => (
                              <Cell
                                key={index}
                                fill={
                                  coloresProductos[
                                  index % coloresProductos.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            align="right"
                            verticalAlign="middle"
                            width={200}
                          />{" "}
                        </PieChart>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay productos en esta categoría
                    </p>
                  )}
                </div>
                {/* Mensaje informativo */}
                <HoverMessage text="Haz clic en un producto para ver su detalle." />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
