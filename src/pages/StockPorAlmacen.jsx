import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { getStockPorAlmacen } from "../api/stock";
import TablaResumenStockAlmacen from "../components/TablaResumenStockAlmacen";
import Pagination from "../components/Pagination";

export default function StockPorAlmacen() {
  const { codigo_almacen } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [stock, setStock] = useState([]);
  const [nombreAlmacen, setNombreAlmacen] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        const { data, total } = await getStockPorAlmacen(
          codigo_almacen,
          accessToken,
          limit,
          offset
        );
        setStock(data);
        setTotal(total);

        if (data.length > 0) {
          setNombreAlmacen(data[0].nombre_almacen);
        }
      } catch (error) {
        console.error("Error al obtener stock del almacén:", error);
        alert("No se pudo cargar el stock de este almacén.");
        navigate("/almacenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [codigo_almacen, accessToken, limit, offset, navigate]);

  useEffect(() => {
    document.title = "Stock por Almacén";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Stock en {nombreAlmacen} (#{codigo_almacen})
          </h1>

          <button
            role="button"
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline text-sm"
          >
            ← Volver
          </button>

          {isLoading ? (
            <p className="text-sm text-gray-600">Cargando...</p>
          ) : stock.length === 0 ? (
            <p className="text-sm text-gray-600">
              No hay stock registrado en este almacén.
            </p>
          ) : (
            <>
              <TablaResumenStockAlmacen
                stock={stock}
                onVerHistorial={(tipo, item) => {
                  if (tipo === "producto") {
                    navigate(
                      `/stock/almacen/${item.codigo_almacen}/productos/${item.codigo_producto}/historial`
                    );
                  } else if (tipo === "total") {
                    navigate(`/stock/almacen/${item.codigo_almacen}/historial`);
                  }
                }}
              />

              <Pagination
                total={total}
                limit={limit}
                offset={offset}
                onPageChange={(nuevoOffset) => setOffset(nuevoOffset)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
