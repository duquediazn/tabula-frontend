import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function TablaListadoUsuarios({
  usuarios,
  onEliminar,
  seleccionados,
  toggleSeleccionado,
  toggleTodos,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={
                  usuarios.length > 0 &&
                  seleccionados.length === usuarios.length
                }
                onChange={toggleTodos}
              />
            </th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Activo</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(u.id)}
                  onChange={() => toggleSeleccionado(u.id)}
                />
              </td>
              <td className="px-4 py-2">{u.nombre}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.rol}</td>
              <td className="px-4 py-2">
                {u.activo ? (
                  <span className="text-green-600 font-medium">Sí</span>
                ) : (
                  <span className="text-red-500 font-medium">No</span>
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  role="button"
                  onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                  className="text-indigo-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  role="button"
                  onClick={() => onEliminar(u.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
