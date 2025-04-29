import { useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import AsyncSelect from "react-select/async";
import { crearMovimiento } from "../api/movimientos";
import { buscarProductos } from "../api/productos";
import { buscarAlmacenes } from "../api/almacenes";
import { useEffect } from "react";
import { getLotesDisponibles } from "../api/stock";
import { useLocation } from "react-router-dom";

export default function CrearMovimiento() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const datosIniciales = location.state || {};
  const [tipo, setTipo] = useState(datosIniciales.tipo || "entrada");
  const [errores, setErrores] = useState({});
  const [lotesDisponibles, setLotesDisponibles] = useState({});
  const [lineas, setLineas] = useState([
    datosIniciales.linea
      ? {
          ...datosIniciales.linea,
          cantidad: datosIniciales.linea.cantidad || 1,
        }
      : {
          codigo_almacen: "",
          codigo_producto: "",
          lote: "",
          fecha_cad: "",
          cantidad: 1,
        },
  ]);

  useEffect(() => {
    document.title = "Nuevo Movimiento";
  }, []);

  const loadOpcionesProductos = async (inputValue, callback) => {
    if (inputValue.length < 4) {
      callback([]);
      return;
    }

    try {
      const productos = await buscarProductos(inputValue, accessToken, 20, 0);
      const opciones = productos.map((p) => ({
        value: p.codigo,
        label: p.nombre_corto + (p.activo ? "" : " (inactivo)"),
        isDisabled: !p.activo,
      }));
      callback(opciones);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      callback([]);
    }
  };

  const loadOpcionesAlmacenes = async (inputValue, callback) => {
    if (inputValue.length < 4) {
      callback([]);
      return;
    }

    try {
      const almacenes = await buscarAlmacenes(inputValue, accessToken, 20, 0);
      const opciones = almacenes.map((a) => ({
        value: a.codigo,
        label: a.descripcion + (a.activo ? "" : " (inactivo)"),
        isDisabled: !a.activo,
      }));
      callback(opciones);
    } catch (error) {
      console.error("Error al cargar almacenes:", error);
      callback([]);
    }
  };

  const handleChangeLinea = async (index, field, value, label = null) => {
    const nuevasLineas = [...lineas];
    nuevasLineas[index][field] = value;

    if (field === "codigo_producto" && label) {
      nuevasLineas[index].label_producto = label;
    }

    if (field === "codigo_almacen" && label) {
      nuevasLineas[index].label_almacen = label;
    }

    setLineas(nuevasLineas);

    // Si es salida y tenemos producto + almacén, cargamos lotes
    const linea = nuevasLineas[index];
    if (
      tipo === "salida" &&
      linea.codigo_producto &&
      linea.codigo_almacen &&
      (field === "codigo_producto" || field === "codigo_almacen")
    ) {
      try {
        const lotes = await getLotesDisponibles({
          codigo_producto: linea.codigo_producto,
          codigo_almacen: linea.codigo_almacen,
          accessToken,
        });
        setLotesDisponibles((prev) => ({
          ...prev,
          [index]: lotes,
        }));
      } catch (err) {
        console.error("Error al cargar lotes:", err.message);
        setLotesDisponibles((prev) => ({ ...prev, [index]: [] }));
      }
    }
  };

  const handleAgregarLinea = () => {
    setLineas([
      ...lineas,
      {
        codigo_almacen: "",
        codigo_producto: "",
        lote: "",
        fecha_cad: "",
        cantidad: 1,
      },
    ]);
  };

  const handleEliminarLinea = (index) => {
    const nuevasLineas = lineas.filter((_, i) => i !== index);
    setLineas(nuevasLineas);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    lineas.forEach((l, index) => {
      if (!l.codigo_almacen) {
        nuevosErrores[`codigo_almacen_${index}`] = "Campo requerido";
      }
      if (!l.codigo_producto) {
        nuevosErrores[`codigo_producto_${index}`] = "Campo requerido";
      }
      if (!l.cantidad || isNaN(l.cantidad) || l.cantidad < 1) {
        nuevosErrores[`cantidad_${index}`] = "Cantidad inválida";
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movimiento = {
      tipo,
      id_usuario: user.id, // desde el contexto
      lineas: lineas.map((l) => ({
        cantidad: parseInt(l.cantidad),
        codigo_almacen: parseInt(l.codigo_almacen),
        codigo_producto: parseInt(l.codigo_producto),
        fecha_cad: l.fecha_cad || null,
        lote: l.lote?.trim() || "SIN_LOTE",
      })),
    };

    if (!validarFormulario()) return;

    try {
      await crearMovimiento(movimiento, accessToken);
      alert("Movimiento registrado correctamente");
      navigate("/movimientos/listado");
    } catch (err) {
      console.error(err);
      alert("Error al registrar el movimiento:\n" + err.message);
    }
  };

  const opcionesTipo = [
    { value: "entrada", label: "Entrada" },
    { value: "salida", label: "Salida" },
  ];

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Nuevo Movimiento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full max-w-xs">
            <label
              htmlFor="tipo-movimiento"
              className="block font-medium text-gray-700 mb-1"
            >
              Tipo de movimiento
            </label>
            <AsyncSelect
              id="tipo-movimiento"
              defaultOptions={opcionesTipo}
              loadOptions={(inputValue, callback) => {
                // Devuelve las mismas opciones siempre, sin buscar
                callback(opcionesTipo);
              }}
              onChange={(opcion) => setTipo(opcion?.value || "")}
              value={opcionesTipo.find((opt) => opt.value === tipo) || null}
              isClearable
              className="text-sm w-70"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>

          <div>
            <h2 className="block font-medium text-gray-700 mb-1">
              Líneas de movimiento
            </h2>

            <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
              <span>ℹ️</span>
              <span>
                Los campos de <strong>producto</strong> y{" "}
                <strong>almacén</strong> se cargan automáticamente cuando
                escribes al menos 4 letras.
              </span>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded">
              <table className="min-w-[900px] w-full divide-y divide-gray-200 text-sm text-gray-800">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 min-w-[250px]">Almacén</th>
                    <th className="px-4 py-2 min-w-[250px]">Producto</th>
                    <th className="px-4 py-2 min-w-[250px]">Lote</th>
                    <th className="px-4 py-2 min-w-[250px]">Fecha caducidad</th>
                    <th className="px-4 py-2 ">Cantidad</th>
                    <th className="px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lineas.map((linea, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {/* Almacén */}
                      <td className="px-4 py-2">
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadOpcionesAlmacenes}
                          onChange={(opcion) =>
                            handleChangeLinea(
                              index,
                              "codigo_almacen",
                              opcion?.value || "",
                              opcion?.label || null
                            )
                          }
                          value={
                            linea.codigo_almacen
                              ? {
                                  value: linea.codigo_almacen,
                                  label:
                                    linea.label_almacen ||
                                    "Almacén seleccionado",
                                }
                              : null
                          }
                          placeholder="Selecciona un almacén..."
                          isClearable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          className="text-sm w-full"
                          classNamePrefix="react-select"
                        />
                        <div className="min-h-[1.25rem]">
                          <ErrorMessage
                            message={errores[`codigo_almacen_${index}`]}
                          />
                        </div>
                      </td>

                      {/* Producto */}
                      <td className="px-4 py-2">
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadOpcionesProductos}
                          onChange={(opcion) =>
                            handleChangeLinea(
                              index,
                              "codigo_producto",
                              opcion?.value || "",
                              opcion?.label || null
                            )
                          }
                          value={
                            linea.codigo_producto
                              ? {
                                  value: linea.codigo_producto,
                                  label: linea.label_producto,
                                }
                              : null
                          }
                          placeholder="Selecciona un producto..."
                          isClearable
                          className="text-sm w-full"
                          classNamePrefix="react-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                        <div className="min-h-[1.25rem]">
                          <ErrorMessage
                            message={errores[`codigo_producto_${index}`]}
                          />
                        </div>
                      </td>

                      {/* Lote */}
                      <td className="px-4 py-2">
                        {tipo === "salida" &&
                        lotesDisponibles[index]?.length > 0 ? (
                          <select
                            value={linea.lote}
                            onChange={(e) => {
                              const loteSeleccionado = e.target.value;

                              handleChangeLinea(
                                index,
                                "lote",
                                loteSeleccionado
                              );

                              // Autocompletar fecha de caducidad si existe
                              const loteInfo = lotesDisponibles[index]?.find(
                                (l) => l.lote === loteSeleccionado
                              );

                              if (loteInfo?.fecha_cad) {
                                handleChangeLinea(
                                  index,
                                  "fecha_cad",
                                  loteInfo.fecha_cad
                                );
                              } else {
                                // Limpia la fecha si el lote no tiene
                                handleChangeLinea(index, "fecha_cad", "");
                              }
                            }}
                            className="h-[36px] border border-gray-300 rounded px-2 py-1 w-full text-sm"
                          >
                            <option value="">Selecciona un lote</option>
                            {lotesDisponibles[index].map((lote) => (
                              <option key={lote.lote} value={lote.lote}>
                                {lote.lote} ({lote.cantidad} unidades){" "}
                                {lote.fecha_cad
                                  ? `- cad: ${new Date(
                                      lote.fecha_cad
                                    ).toLocaleDateString()}`
                                  : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={linea.lote}
                            onChange={(e) =>
                              handleChangeLinea(index, "lote", e.target.value)
                            }
                            className="h-[36px] border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        )}
                        <div className="min-h-[1.25rem]"></div>
                      </td>

                      {/* Fecha caducidad */}
                      <td className="px-4 py-2">
                        {(() => {
                          const loteEnLista =
                            tipo === "salida" &&
                            lotesDisponibles[index]?.some(
                              (l) => l.lote === linea.lote
                            );

                          return (
                            <input
                              type="date"
                              value={linea.fecha_cad}
                              readOnly={loteEnLista}
                              onChange={(e) =>
                                handleChangeLinea(
                                  index,
                                  "fecha_cad",
                                  e.target.value
                                )
                              }
                              className={`h-[36px] border border-gray-300 rounded px-2 py-1 w-full text-sm ${
                                loteEnLista
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : "bg-white"
                              }`}
                            />
                          );
                        })()}
                        <div className="min-h-[1.25rem]"></div>
                      </td>

                      {/* Cantidad */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          value={linea.cantidad}
                          onChange={(e) =>
                            handleChangeLinea(
                              index,
                              "cantidad",
                              parseInt(e.target.value)
                            )
                          }
                          className={`h-[36px] border border-gray-300 rounded px-2 py-1 w-full ${
                            errores[`cantidad_${index}`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <div className="min-h-[1.25rem]">
                          <ErrorMessage
                            message={errores[`cantidad_${index}`]}
                          />
                        </div>
                      </td>

                      {/* Botón eliminar */}
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleEliminarLinea(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ✕
                        </button>
                        <div className="min-h-[1.25rem]"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón añadir línea */}
            <div className="mt-2">
              <button
                type="button"
                onClick={handleAgregarLinea}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Añadir línea
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Guardar movimiento
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
