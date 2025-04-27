import API_URL from "./config";

export async function getTodosAlmacenes(
  accessToken,
  limit,
  offset,
  searchTerm = "",
  estado = ""
) {
  const url = new URL(`${API_URL}/almacenes`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);
  if (searchTerm) url.searchParams.append("search", searchTerm);
  if (estado !== "") url.searchParams.append("estado", estado === "true");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener almacenes");
  }

  return await response.json(); // { data, total, ... }
}

export async function buscarAlmacenes(inputValue, accessToken, limit, offset) {
  const response = await fetch(
    `${API_URL}/almacenes?limit=${limit}&offset=${offset}&search=${inputValue}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.data || [];
}

export async function cambiarEstadoAlmacenes(codigos, activo, accessToken) {
  const response = await fetch(`${API_URL}/almacenes/estado-multiple`, {
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
      error.detail || "Error al cambiar el estado de los almacenes"
    );
  }

  return await response.json();
}

export async function crearAlmacen(data, accessToken) {
  const response = await fetch(`${API_URL}/almacenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al crear el almacén");
  }

  return await response.json();
}

export async function getAlmacenById(codigo, accessToken) {
  const response = await fetch(`${API_URL}/almacenes/${codigo}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el almacén");
  }

  return await response.json();
}

export async function actualizarAlmacen(codigo, data, accessToken) {
  const response = await fetch(`${API_URL}/almacenes/${codigo}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el almacén");
  }

  return await response.json();
}
