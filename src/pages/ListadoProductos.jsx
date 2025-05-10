import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import {
  getProductos,
  getCategorias,
  cambiarEstadoProductos,
} from "../api/productos";
import { useNavigate } from "react-router-dom";
import TablaListadoProductos from "../components/TablaListadoProductos";
import ExportCSVButton from "../components/ExportCSVButton";
import { exportarProductosFiltradosCSV } from "../utils/export";
import API_URL from "../api/config";
import SearchInput from "../components/SearchInput";
import SelectFilter from "../components/SelectFilter";
import FiltrosContainer from "../components/FiltrosContainer";
import { mostrarResumenEstado } from "../utils/mostrarResumenEstado";

export default function ListadoProductos() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [estado, setEstado] = useState("");
  const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const { data, total } = await getProductos({
        accessToken,
        limit,
        offset,
        searchTerm,
        id_categoria: idCategoriaSeleccionada,
        estado,
      });
      setProductos(data || []);
      setTotal(total || 0);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [searchTerm, limit, offset, accessToken, idCategoriaSeleccionada, estado]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const lista = await getCategorias(accessToken);
        setCategorias(lista);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Listado Productos";
  }, []);

  const handleEliminarEnListado = (codigoEliminado) => {
    setProductos((prev) => {
      const nuevos = prev.filter((p) => p.codigo !== codigoEliminado);
      if (nuevos.length === 0 && offset >= limit) {
        setOffset(offset - limit);
      }
      return nuevos;
    });
    setTotal((prev) => prev - 1);
  };

  const toggleSeleccionado = (codigo) => {
    setSeleccionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const toggleTodos = () => {
    if (seleccionados.length === productos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(productos.map((p) => p.codigo));
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Listado de productos
          </h1>
          {user?.role === "admin" && (
            <button
              role="button"
              onClick={() => navigate("/productos/nuevo")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
            >
              + Crear producto
            </button>
          )}
        </div>

        <FiltrosContainer
          extraContent={
            <ExportCSVButton
              onExport={() => {
                exportarProductosFiltradosCSV({
                  accessToken,
                  apiUrl: API_URL,
                  filtros: {
                    searchTerm,
                    id_categoria: idCategoriaSeleccionada,
                    estado,
                  },
                });
              }}
              label="📤 Exportar CSV"
            />
          }
        >
          <SearchInput
            label="Buscar"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOffset(0);
            }}
          />

          <SelectFilter
            label="Categoría"
            value={idCategoriaSeleccionada}
            onChange={(e) => {
              setIdCategoriaSeleccionada(e.target.value);
              setOffset(0);
            }}
            options={[
              { value: "", label: "Todas las categorías" },
              ...categorias.map((cat) => ({
                value: cat.id,
                label: cat.nombre,
              })),
            ]}
          />

          <SelectFilter
            label="Estado"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value);
              setOffset(0);
            }}
            options={[
              { value: "", label: "Todos" },
              { value: "true", label: "Activos" },
              { value: "false", label: "Inactivos" },
            ]}
          />
        </FiltrosContainer>

        {user?.role === "admin" && seleccionados.length > 0 && (
          <div className="flex gap-2">
            <button
              role="button"
              onClick={async () => {
                try {
                  const res = await cambiarEstadoProductos(
                    seleccionados.map((c) => parseInt(c)),
                    true,
                    accessToken
                  );

                  mostrarResumenEstado(res, "productos", "activar");

                  setSeleccionados([]);
                  await fetchProductos();
                } catch (error) {
                  alert(
                    error.message ||
                      "Error al cambiar el estado de los productos"
                  );
                }
              }}
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Activar seleccionados
            </button>
            <button
              role="button"
              onClick={async () => {
                try {
                  const res = await cambiarEstadoProductos(
                    seleccionados.map((c) => parseInt(c)),
                    false,
                    accessToken
                  );

                  mostrarResumenEstado(
                    res,
                    "productos",
                    "desactivar",
                    "aún tienen stock"
                  );

                  setSeleccionados([]);
                  await fetchProductos();
                } catch (error) {
                  alert(
                    error.message ||
                      "Error al cambiar el estado de los productos"
                  );
                }
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Desactivar seleccionados
            </button>
          </div>
        )}

        <div className="mt-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando productos...</p>
          ) : (
            <TablaListadoProductos
              productos={productos}
              onEliminar={handleEliminarEnListado}
              seleccionados={seleccionados}
              toggleSeleccionado={toggleSeleccionado}
              toggleTodos={toggleTodos}
            />
          )}
        </div>

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
