import API_URL from "./config";

export async function getMovimientos({
  accessToken,
  filtros = {},
  limit = 10,
  offset = 0,
}) {
  const queryParams = new URLSearchParams();

  if (filtros.searchTerm) queryParams.append("search", filtros.searchTerm);
  if (filtros.tipoFiltro) queryParams.append("tipo", filtros.tipoFiltro);
  if (filtros.fechaDesde) queryParams.append("fecha_desde", filtros.fechaDesde);
  if (filtros.fechaHasta) queryParams.append("fecha_hasta", filtros.fechaHasta);
  if (filtros.usuarioFiltro)
    queryParams.append("usuario_id", filtros.usuarioFiltro);

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);

  const response = await fetch(
    `${API_URL}/movimientos?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return {
    movimientos: data.data || [],
    total: data.total || 0,
  };
}

export async function contarMovimientosPorTipo({ accessToken }) {
  const response = await fetch(`${API_URL}/movimientos/resumen/tipo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
}

export async function getMovimientoById(id, accessToken) {
  const response = await fetch(`${API_URL}/movimientos/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error("No se pudo cargar el movimiento");

  return await response.json();
}

export async function getLineasMovimiento(
  id,
  accessToken,
  limit = 10,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/movimientos/${id}/lineas?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok)
    throw new Error("Error al cargar las líneas del movimiento");

  return await response.json(); // { data: [...], total: n }
}

export async function crearMovimiento(movimiento, accessToken) {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(movimiento),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al registrar el movimiento");
  }

  return await response.json(); // objeto MovementResponse
}

export async function movementsLastYearByMonth(accessToken) {
  const response = await fetch(`${API_URL}/movimientos/last-year`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  const movimientos = data || [];

  const agrupado = {};

  for (const mov of movimientos) {
    const fecha = new Date(mov.fecha);
    const clave = `${fecha.getUTCFullYear()}-${String(
      fecha.getUTCMonth() + 1
    ).padStart(2, "0")}`;

    const tipo = mov.tipo.toLowerCase().trim();

    if (!agrupado[clave]) {
      agrupado[clave] = { mes: clave, entrada: 0, salida: 0 };
    }

    if (tipo === "entrada" || tipo === "salida") {
      agrupado[clave][tipo]++;
    } else {
      console.warn("Tipo de movimiento desconocido:", mov.tipo);
    }
  }

  return Object.values(agrupado).sort((a, b) => (a.mes > b.mes ? 1 : -1));
}
