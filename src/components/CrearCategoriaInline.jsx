import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { crearCategoria } from "../api/productos";
import { useAuth } from "../context/useAuth";

export default function CrearCategoriaInline({ onCategoriaCreada }) {
  const { accessToken } = useAuth();
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const handleAgregar = async () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const nueva = await crearCategoria(nombre.trim(), accessToken);
      onCategoriaCreada(nueva);
      setNombre("");
      setError("");
    } catch (e) {
      setError(e.message || "Error al crear la categoría");
    }
  };

  return (
    <div className="mt-4 space-y-1">
      <label
        htmlFor="categoria"
        className="block text-sm font-medium text-gray-700"
      >
        ¿No encuentras la categoría?
      </label>
      <div className="flex gap-2">
        <input
          id="categoria"
          type="text"
          placeholder="Nueva categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          role="button"
          type="button"
          onClick={handleAgregar}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-sm"
        >
          Añadir
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}
