import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/useAuth";
import { getProductoById } from "../api/productos";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await getProductoById(id, accessToken);
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        alert("No se pudo cargar el producto");
        navigate("/productos/listado");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, accessToken, navigate]);

  useEffect(() => {
    document.title = "Detalle Producto";
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Breadcrumb />
        <div className="p-6 text-gray-700">Cargando producto...</div>
      </>
    );
  }

  if (!producto) return null;

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Detalle del producto
          </h1>
          <button
            role="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Volver atrás
          </button>

          <div className="bg-white shadow rounded p-4 text-sm text-gray-700 space-y-2">
            <p>
              <strong>SKU:</strong> {producto.sku}
            </p>
            <p>
              <strong>Nombre:</strong> {producto.nombre_corto}
            </p>
            <p>
              <strong>Categoría:</strong> {producto.nombre_categoria}
            </p>
            <p>
              <strong>Descripción:</strong> {producto.descripcion || "—"}
            </p>
            <p>
              <strong>Estado:</strong> {producto.activo ? "Activo" : "Inactivo"}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            {user?.role === "admin" && (
              <button
                role="button"
                onClick={() => navigate(`/productos/${producto.codigo}/editar`)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm"
              >
                Editar producto
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
