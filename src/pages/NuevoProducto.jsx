import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/useAuth";
import { getCategorias, crearProducto } from "../api/productos";
import CrearCategoriaInline from "../components/CrearCategoriaInline";

export default function NuevoProducto() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    sku: "",
    nombre_corto: "",
    descripcion: "",
    id_categoria: "",
  });

  const [errores, setErrores] = useState({});
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const lista = await getCategorias(accessToken);
        setCategorias(lista);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();
  }, [accessToken]);

  useEffect(() => {
    document.title = "Nuevo Producto";
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.sku.trim()) nuevosErrores.sku = "El SKU es obligatorio";
    if (!formulario.nombre_corto.trim())
      nuevosErrores.nombre_corto = "El nombre es obligatorio";
    if (!formulario.id_categoria)
      nuevosErrores.id_categoria = "La categoría es obligatoria";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      await crearProducto(formulario, accessToken);
      alert("Producto creado correctamente");
      navigate("/productos/listado");
    } catch (error) {
      console.error(error);
      alert("Error al crear el producto:\n" + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Nuevo producto</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU */}
            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                SKU
              </label>
              <input
                id="sku"
                type="text"
                name="sku"
                value={formulario.sku}
                onChange={handleChange}
                className="h-[36px] bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.sku} />
            </div>

            {/* Nombre corto */}
            <div>
              <label
                htmlFor="nuevo-corto"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre corto
              </label>
              <input
                id="nuevo-corto"
                type="text"
                name="nombre_corto"
                value={formulario.nombre_corto}
                onChange={handleChange}
                className="h-[36px]  bg-white w-full rounded border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <ErrorMessage message={errores.nombre_corto} />
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full  bg-white rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="id_categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              <select
                id="id_categoria"
                name="id_categoria"
                value={formulario.id_categoria}
                onChange={handleChange}
                className="w-full  bg-white h-[36px] rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              {/* Crear nueva categoría */}
              <CrearCategoriaInline
                onCategoriaCreada={(nueva) => {
                  setCategorias((prev) => [...prev, nueva]);
                  setFormulario((f) => ({ ...f, id_categoria: nueva.id }));
                }}
              />
              <ErrorMessage message={errores.id_categoria} />
            </div>

            <div className="flex gap-3">
              <button
                role="button"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Guardar producto
              </button>
              <button
                role="button"
                type="button"
                onClick={() => navigate("/productos/listado")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
