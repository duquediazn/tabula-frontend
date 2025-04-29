import { useNavigate } from "react-router-dom";

export default function TablaStockProducto({
  stock,
  onVerHistorial,
  mostrarAcciones = true,
}) {
  const totalGeneral = stock.reduce((sum, item) => sum + item.cantidad, 0);
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Almacén</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Lote</th>
            <th className="px-4 py-3">Fecha caducidad</th>
            <th className="px-4 py-3">Cantidad</th>
            {mostrarAcciones && <th className="px-4 py-3">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stock.map((linea, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2">{linea.nombre_almacen}</td>
              <td className="px-4 py-2">{linea.nombre_producto}</td>
              <td className="px-4 py-2">{linea.sku}</td>
              <td className="px-4 py-2">{linea.lote}</td>
              <td className="px-4 py-2">{linea.fecha_cad ?? "Sin fecha"}</td>
              <td className="px-4 py-2">{linea.cantidad}</td>
              {mostrarAcciones && (
                <td className="px-4 py-2 space-y-1">
                  <button
                    role="button"
                    className="block text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    onClick={() => linea && onVerHistorial?.(linea)}
                  >
                    Ver historial
                  </button>
                  <button
                    role="button"
                    className="block text-green-600 hover:text-green-800 font-medium text-sm"
                    onClick={() =>
                      navigate("/movimientos/nuevo", {
                        state: {
                          tipo: "salida",
                          linea: {
                            codigo_producto: linea.codigo_producto,
                            codigo_almacen: linea.codigo_almacen,
                            lote: linea.lote,
                            fecha_cad: linea.fecha_cad,
                            cantidad: linea.cantidad,
                            label_producto: linea.nombre_producto,
                            label_almacen: linea.nombre_almacen,
                          },
                        },
                      })
                    }
                  >
                    Crear salida
                  </button>
                </td>
              )}
            </tr>
          ))}
          {/* Fila total */}
          <tr className="bg-gray-50 font-semibold">
            <td className="px-4 py-2" colSpan={5}>
              Total general
            </td>
            <td className="px-4 py-2">{totalGeneral}</td>
            <td className="px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
