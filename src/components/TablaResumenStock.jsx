export default function TablaResumenStock({ stock, onVerHistorial }) {
  const totalGeneral = stock.reduce(
    (sum, item) => sum + item.total_cantidad,
    0
  );

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Almacén</th>
            <th className="px-4 py-3">Código almacén</th>
            <th className="px-4 py-3">Cantidad total</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stock.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">{item.nombre_almacen}</td>
              <td className="px-4 py-2">{item.codigo_almacen}</td>
              <td className="px-4 py-2">{item.total_cantidad}</td>
              <td className="px-4 py-2">
                <button
                  role="button"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  onClick={() => item && onVerHistorial?.("almacen", item)}
                >
                  Ver historial en almacén
                </button>
              </td>
            </tr>
          ))}

          {/* Fila total */}
          <tr className="bg-gray-50 font-semibold">
            <td className="px-4 py-2" colSpan={2}>
              Total general
            </td>
            <td className="px-4 py-2">{totalGeneral}</td>
            <td className="px-4 py-2">
              <button
                role="button"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => stock[0] && onVerHistorial?.("total", stock[0])}
              >
                Ver historial total
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
