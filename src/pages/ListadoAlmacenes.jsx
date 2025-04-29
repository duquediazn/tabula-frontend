import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import { getTodosAlmacenes, cambiarEstadoAlmacenes } from "../api/almacenes";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import SelectFilter from "../components/SelectFilter";
import FiltrosContainer from "../components/FiltrosContainer";
import { mostrarResumenEstado } from "../utils/mostrarResumenEstado";
import ExportCSVButton from "../components/ExportCSVButton";
import { exportarAlmacenesFiltradosCSV } from "../utils/export";
import API_URL from "../api/config";

export default function ListadoAlmacenes() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);

  const fetchAlmacenes = async () => {
    setIsLoading(true);
    try {
      const { data, total } = await getTodosAlmacenes(
        accessToken,
        limit,
        offset,
        searchTerm,
        estado
      );
      setAlmacenes(data);
      setTotal(total);
    } catch (err) {
      console.error("Error al cargar almacenes:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlmacenes();
  }, [searchTerm, estado, offset, limit, accessToken]);

  const toggleSeleccionado = (codigo) => {
    setSeleccionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  useEffect(() => {
    document.title = "Listado Almacenes";
  }, []);

  const toggleTodos = () => {
    if (seleccionados.length === almacenes.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(almacenes.map((a) => a.codigo));
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Listado de almacenes
          </h1>
          {user?.role === "admin" && (
            <button
              role="button"
              onClick={() => navigate("/almacenes/nuevo")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
            >
              + Crear almacén
            </button>
          )}
        </div>

        <FiltrosContainer
          extraContent={
            <ExportCSVButton
              onExport={() =>
                exportarAlmacenesFiltradosCSV({
                  accessToken,
                  apiUrl: API_URL,
                  filtros: {
                    searchTerm,
                    estado,
                  },
                })
              }
              label="📤 Exportar CSV"
            />
          }
        >
          <SearchInput
            label="Buscar"
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOffset(0);
            }}
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
                  const res = await cambiarEstadoAlmacenes(
                    seleccionados.map((c) => parseInt(c)),
                    true,
                    accessToken
                  );

                  mostrarResumenEstado(res, "almacenes", "activar");

                  setSeleccionados([]);
                  await fetchAlmacenes();
                } catch (error) {
                  alert(
                    error.message ||
                      "Error al cambiar el estado de los almacenes"
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
                  const res = await cambiarEstadoAlmacenes(
                    seleccionados.map((c) => parseInt(c)),
                    false,
                    accessToken
                  );

                  mostrarResumenEstado(res, "almacenes", "desactivar");

                  setSeleccionados([]);
                  await fetchAlmacenes();
                } catch (error) {
                  alert(
                    error.message ||
                      "Error al cambiar el estado de los almacenes"
                  );
                }
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Desactivar seleccionados
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-gray-500">Cargando almacenes...</p>
        ) : (
          <div className="mt-4 overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        almacenes.length > 0 &&
                        seleccionados.length === almacenes.length
                      }
                      onChange={toggleTodos}
                    />
                  </th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {almacenes.map((alm) => (
                  <tr key={alm.codigo} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(alm.codigo)}
                        onChange={() => toggleSeleccionado(alm.codigo)}
                      />
                    </td>
                    <td className="px-4 py-2">{alm.codigo}</td>
                    <td className="px-4 py-2">{alm.descripcion}</td>
                    <td className="px-4 py-2">
                      {alm.activo ? (
                        <span className="text-green-600 font-medium">
                          Activo
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        role="button"
                        onClick={() => navigate(`/almacenes/${alm.codigo}`)}
                        className="text-indigo-600 hover:underline"
                      >
                        Ver almacén
                      </button>
                      {user?.role === "admin" && (
                        <>
                          <button
                            role="button"
                            onClick={() =>
                              navigate(`/almacenes/${alm.codigo}/editar`)
                            }
                            className="text-indigo-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            role="button"
                            onClick={() =>
                              navigate(`/stock/almacen/${alm.codigo}`)
                            }
                            className="text-indigo-600 hover:underline"
                          >
                            Ver stock
                          </button>
                        </>
                      )}
                    </td>
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
    </>
  );
}
