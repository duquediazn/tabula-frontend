import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import SelectFilter from "../components/SelectFilter";
import FiltrosContainer from "../components/FiltrosContainer";
import ExportCSVButton from "../components/ExportCSVButton";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import {
  getUsuarios,
  eliminarUsuario,
  cambiarEstadoUsuarios,
} from "../api/users";
import TablaListadoUsuarios from "../components/TablaListadoUsuarios";
import { exportarUsuariosFiltradosCSV } from "../utils/export";
import API_URL from "../api/config";

export default function Usuarios() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [seleccionados, setSeleccionados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data, total } = await getUsuarios({
        accessToken,
        limit,
        offset,
        searchTerm,
        estado,
      });
      setUsuarios(data || []);
      setTotal(total || 0);
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [searchTerm, estado, offset, limit]);

  useEffect(() => {
    document.title = "Usuarios";
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    try {
      await eliminarUsuario(id, accessToken);
      alert("Usuario eliminado");
      fetchUsuarios();
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleSeleccionado = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleTodos = () => {
    if (seleccionados.length === usuarios.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(usuarios.map((u) => u.id));
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6 mx-auto space-y-6 max-w-7xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
          <button
            role="button"
            onClick={() => navigate("/usuarios/nuevo")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
          >
            + Crear usuario
          </button>
        </div>

        <FiltrosContainer
          extraContent={
            <ExportCSVButton
              onExport={() =>
                exportarUsuariosFiltradosCSV({
                  accessToken,
                  filtros: { estado, searchTerm },
                  apiUrl: API_URL,
                })
              }
              label="📤 Exportar CSV"
            />
          }
        >
          <SearchInput
            label="Buscar"
            placeholder="Buscar por nombre o email..."
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

        {seleccionados.length > 0 && (
          <div className="flex gap-2">
            <button
              role="button"
              onClick={async () => {
                try {
                  await cambiarEstadoUsuarios(seleccionados, true, accessToken);
                  alert("Usuarios activados");
                  setSeleccionados([]);
                  fetchUsuarios();
                } catch (e) {
                  alert(e.message);
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
                  await cambiarEstadoUsuarios(
                    seleccionados,
                    false,
                    accessToken
                  );
                  alert("Usuarios desactivados");
                  setSeleccionados([]);
                  fetchUsuarios();
                } catch (e) {
                  alert(e.message);
                }
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Desactivar seleccionados
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-gray-500">Cargando usuarios...</p>
        ) : (
          <TablaListadoUsuarios
            usuarios={usuarios}
            onEliminar={handleEliminar}
            seleccionados={seleccionados}
            toggleSeleccionado={toggleSeleccionado}
            toggleTodos={toggleTodos}
          />
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
