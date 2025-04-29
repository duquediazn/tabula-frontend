import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { eliminarProducto } from "../api/productos";

export default function TablaListadoProductos({
  productos,
  onEliminar,
  seleccionados,
  toggleSeleccionado,
  toggleTodos,
}) {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleEliminar = async (codigo) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      await eliminarProducto(codigo, accessToken);
      alert("Producto eliminado correctamente");
      onEliminar?.(codigo);
    } catch (error) {
      alert(error.message || "Error al eliminar el producto");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={
                  productos.length > 0 &&
                  seleccionados.length === productos.length
                }
                onChange={toggleTodos}
              />
            </th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Activo</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {productos.map((producto) => (
            <tr key={producto.codigo} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(producto.codigo)}
                  onChange={() => toggleSeleccionado(producto.codigo)}
                />
              </td>
              <td className="px-4 py-2">{producto.sku}</td>
              <td className="px-4 py-2">{producto.nombre_corto}</td>
              <td className="px-4 py-2">
                {producto.nombre_categoria || "Sin categoría"}
              </td>
              <td className="px-4 py-2">
                {producto.activo ? (
                  <span className="text-green-600 font-medium">Sí</span>
                ) : (
                  <span className="text-red-500 font-medium">No</span>
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  role="button"
                  onClick={() => navigate(`/productos/${producto.codigo}`)}
                  className="text-indigo-600 hover:underline"
                >
                  Ver producto
                </button>
                <button
                  role="button"
                  onClick={() =>
                    navigate(`/productos/${producto.codigo}/stock`)
                  }
                  className="text-indigo-600 hover:underline"
                >
                  Ver stock
                </button>
                {user?.role === "admin" && (
                  <>
                    <button
                      role="button"
                      onClick={() =>
                        navigate(`/productos/${producto.codigo}/editar`)
                      }
                      className="text-indigo-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      role="button"
                      onClick={() => handleEliminar(producto.codigo)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
