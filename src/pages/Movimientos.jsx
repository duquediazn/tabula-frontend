import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "../context/useAuth";
import {
  contarMovimientosPorTipo,
  movementsLastYearByMonth,
} from "../api/movimientos";

export default function Movimientos() {
  const { accessToken } = useAuth();
  const [datosTipo, setDatosTipo] = useState([]);
  const [datosMensuales, setDatosMensuales] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await contarMovimientosPorTipo({ accessToken });
        setDatosTipo(data);
      } catch (error) {
        console.error("Error al cargar datos por tipo:", error);
      }
    };

    fetchDatos();
  }, [accessToken]);

  useEffect(() => {
    const fetchMensual = async () => {
      try {
        const hoy = new Date();
        const haceUnAno = new Date();
        haceUnAno.setFullYear(hoy.getFullYear() - 1);

        const data = await movementsLastYearByMonth(accessToken);
        setDatosMensuales(data);
      } catch (error) {
        console.error("Error al cargar datos mensuales:", error);
      }
    };

    fetchMensual();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Movimientos";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Movimientos</h1>
          {/* Accesos rápidos */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg text-center font-semibold mb-4">
              Accesos rápidos
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/movimientos/nuevo"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
              >
                + Crear movimiento
              </Link>
              <Link
                to="/movimientos/listado"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium"
              >
                📋 Ver listado
              </Link>
            </div>
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de barras por tipo */}
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold mb-4">
                Movimientos por tipo
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={datosTipo}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Gráfico de línea por mes */}
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold mb-4">
                Evolución mensual en el último año
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={datosMensuales}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="entrada"
                        stroke="#22C55E"
                        name="Entradas"
                      />
                      <Line
                        type="monotone"
                        dataKey="salida"
                        stroke="#EF4444"
                        name="Salidas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
