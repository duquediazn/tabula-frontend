import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import API_URL from "../api/config";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import { getMovimientos } from "../api/movimientos";
import { getUsuarios } from "../api/users";
import ExportCSVButton from "../components/ExportCSVButton";
import { exportarMovimientosFiltradosCSV } from "../utils/export";
import SearchInput from "../components/SearchInput";
import SelectFilter from "../components/SelectFilter";
import FiltrosContainer from "../components/FiltrosContainer";

export default function ListadoMovimientos() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { movimientos, total } = await getMovimientos({
          accessToken,
          filtros: {
            searchTerm,
            tipoFiltro,
            fechaDesde,
            fechaHasta,
            usuarioFiltro,
          },
          limit,
          offset,
        });
        setMovimientos(movimientos);
        setTotal(total);
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    searchTerm,
    tipoFiltro,
    fechaDesde,
    fechaHasta,
    usuarioFiltro,
    offset,
    limit,
    accessToken,
  ]);

  useEffect(() => {
    if (!isLoading && user?.role === "admin" && accessToken) {
      getUsuarios({ accessToken, limit: 50 })
        .then((res) => setUsuarios(res.data || []))
        .catch((err) => {
          console.error("Error al cargar usuarios:", err.message);
          if (err.message?.toLowerCase().includes("token")) {
            console.warn("Posible sesión expirada o token inválido");
          }
        });
    }
  }, [accessToken, user, isLoading]);

  useEffect(() => {
    document.title = "Listado Movimientos";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Listado de movimientos
        </h1>

        <FiltrosContainer
          extraContent={
            <ExportCSVButton
              onExport={() =>
                exportarMovimientosFiltradosCSV({
                  accessToken,
                  apiUrl: API_URL,
                  filtros: {
                    searchTerm,
                    tipoFiltro,
                    fechaDesde,
                    fechaHasta,
                    usuarioFiltro,
                  },
                })
              }
              label="📤 Exportar CSV"
            />
          }
        >
          <div>
            <label
              htmlFor="fecha-desde"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha desde
            </label>
            <input
              id="fecha-desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setOffset(0);
              }}
              className="h-[36px] bg-white rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="fecha-hasta"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha hasta
            </label>
            <input
              id="fecha-hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setOffset(0);
              }}
              className="h-[36px] bg-white rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {user?.role === "admin" && (
            <SelectFilter
              label="Usuario"
              value={usuarioFiltro}
              onChange={(e) => {
                setUsuarioFiltro(e.target.value);
                setOffset(0);
              }}
              options={[
                { value: "", label: "Todos" },
                ...usuarios.map((u) => ({ value: u.id, label: u.nombre })),
              ]}
              className="max-w-[180px]"
            />
          )}

          <SelectFilter
            label="Tipo"
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value);
              setOffset(0);
            }}
            options={[
              { value: "", label: "Todos" },
              { value: "entrada", label: "Entrada" },
              { value: "salida", label: "Salida" },
            ]}
            className="max-w-[150px]"
          />

          <SearchInput
            label="Buscar"
            placeholder="Buscar por usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FiltrosContainer>

        <div className="overflow-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Líneas</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Cargando movimientos...
                  </td>
                </tr>
              ) : movimientos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No se encontraron movimientos.
                  </td>
                </tr>
              ) : (
                movimientos.map((mov) => (
                  <tr key={mov.id_mov} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{mov.id_mov}</td>
                    <td className="px-4 py-2 capitalize">{mov.tipo}</td>
                    <td className="px-4 py-2">{mov.nombre_usuario}</td>
                    <td className="px-4 py-2">
                      {new Date(mov.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{mov.lineas?.length || 0}</td>
                    <td className="px-4 py-2">
                      <button
                        role="button"
                        onClick={() => navigate(`/movimientos/${mov.id_mov}`)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
