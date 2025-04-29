import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Breadcrumb from "../components/Breadcrumb";
import Navbar from "../components/Navbar";
import TablaStockProductoCaducidad from "../components/TablaStockProductoCaducidad";
import { getProductosCaducidad } from "../api/stock";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function StockProducto() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const [stock, setStock] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductosCaducidad({
          accessToken,
          desde,
          hasta,
          limit,
          offset,
        });
        setStock(data.data);
        setTotal(data.total);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    if (desde && hasta) {
      fetchData();
    }
  }, [accessToken, desde, hasta, limit, offset]);

  useEffect(() => {
    document.title = "Stock Producto por Caducidad";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Productos próximos a caducar
        </h1>
        <button
          role="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver atrás
        </button>
        <TablaStockProductoCaducidad
          stock={stock}
          onVerHistorial={(linea) =>
            navigate(`/productos/${linea.codigo_producto}/historial`)
          }
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
