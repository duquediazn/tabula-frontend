import API_URL from "./config";

export async function getUserById(id, accessToken) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener datos del usuario");
  }

  return await response.json(); // devuelve { id, nombre, email, rol, activo }
}

export async function updateUser(id, token, data) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    // Si hay un detalle más específico (como error.detail), lo usamos
    const message = error.detail || "Error al actualizar el perfil";
    throw new Error(message);
  }

  return await response.json(); // Devuelve el usuario actualizado
}

export async function getUsuarios({
  accessToken,
  limit = 10,
  offset = 0,
  searchTerm = "",
  estado = "",
}) {
  const url = new URL(`${API_URL}/usuarios`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (searchTerm?.trim()) url.searchParams.append("search", searchTerm);
  if (estado === "true" || estado === "false")
    url.searchParams.append("estado", estado);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener usuarios");
  }

  return await response.json(); // { data, total, limit, offset }
}

export async function cambiarEstadoUsuarios(ids, activo, accessToken) {
  const response = await fetch(`${API_URL}/usuarios/estado-multiple`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ids, activo }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Error al actualizar usuarios");
  }

  return data; // { mensaje, omitidos }
}

export async function eliminarUsuario(id, accessToken) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Error al eliminar usuario");
  }

  return data;
}

export async function crearUsuario(data, accessToken) {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al crear usuario");
  }

  return await response.json();
}
