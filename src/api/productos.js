import API_URL from "./config";

export async function getProductos({
  accessToken,
  limit = 10,
  offset = 0,
  searchTerm = "",
  id_categoria = "",
  estado = "",
}) {
  const url = new URL(`${API_URL}/productos`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (searchTerm) url.searchParams.append("search", searchTerm);
  if (id_categoria) url.searchParams.append("id_categoria", id_categoria);
  if (estado !== "") url.searchParams.append("estado", estado);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener productos");
  }

  return await response.json(); // { data, total, ... }
}

export async function buscarProductos(inputValue, accessToken, limit, offset) {
  const response = await fetch(
    `${API_URL}/productos?limit=${limit}&offset=${offset}&search=${inputValue}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.data || [];
}

export async function getProductoById(id, accessToken) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el producto");
  }

  return await response.json(); // Devuelve el producto
}

export async function crearProducto(data, accessToken) {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al crear el producto");
  }

  return await response.json();
}

export async function actualizarProducto(id, data, accessToken) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el producto");
  }

  return await response.json();
}

export async function eliminarProducto(id, accessToken) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al eliminar el producto");
  }

  return await response.json();
}

export async function getCategorias(accessToken, limit = 100, offset = 0) {
  const url = new URL(`${API_URL}/categorias`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener las categorías");
  }

  const data = await response.json();
  return data.data || []; // [{ id, nombre }, ...]
}

export async function cambiarEstadoProductos(codigos, activo, accessToken) {
  const response = await fetch(`${API_URL}/productos/estado-multiple`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ codigos, activo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Error al cambiar el estado de los productos"
    );
  }

  return await response.json();
}

export async function crearCategoria(nombre, accessToken) {
  const res = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ nombre }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Error al crear categoría");
  }

  return await res.json();
}


export async function editarCategoria(id, nombre, accessToken) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ nombre }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Error inesperado al editar la categoría");
  }

  if (!res.ok) {
    throw new Error(data.detail || "Error al editar la categoría");
  }

  return data;
}


export async function eliminarCategoria(id, accessToken) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Error inesperado al eliminar la categoría");
  }

  if (!res.ok) {
    throw new Error(data.detail || "No se pudo eliminar la categoría");
  }

  return data;
}
