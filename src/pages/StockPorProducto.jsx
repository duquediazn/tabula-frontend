import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import TablaResumenStock from "../components/TablaResumenStock";
import { useAuth } from "../context/useAuth";
import { getStockPorProducto, getHistorialProducto } from "../api/stock";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function StockPorProducto() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [sku, setSku] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStockPorProducto(id, accessToken, limit, offset);
        setStock(data.data);
        setTotal(data.total);
      } catch (error) {
        console.error("Error al cargar stock del producto:", error.message);
      }
    };

    fetchData();
  }, [id, accessToken, limit, offset]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorialProducto(id, accessToken, 100);
        setSku(data.data[0]?.sku_producto);
      } catch (error) {
        console.error("Error al obtener historial:", error.message);
      }
    };

    fetchHistorial();
  }, [id, accessToken]);

  useEffect(() => {
    document.title = "Stock por Producto";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Stock del producto {sku}
        </h1>
        <button
          role="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver atrás
        </button>

        <TablaResumenStock
          stock={stock}
          onVerHistorial={(tipo, item) => {
            if (tipo === "almacen") {
              navigate(
                `/stock/almacen/${item.codigo_almacen}/productos/${item.codigo_producto}/historial`
              );
            } else if (tipo === "total") {
              navigate(`/productos/${item.codigo_producto}/historial`);
            }
          }}
        />

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
