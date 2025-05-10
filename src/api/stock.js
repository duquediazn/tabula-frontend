import API_URL from "./config";

export async function getSemaforo(accessToken) {
  const response = await fetch(`${API_URL}/stock/semaforo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el estado del semáforo");
  }

  return await response.json(); // { no_caduca, caduca_proximamente, caduca_ya }
}

export async function getDetalleAlmacenes(accessToken) {
  const response = await fetch(`${API_URL}/stock/almacenes/detalle`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener detalle de almacenes");
  }

  const data = await response.json();
  return data;
}

export async function getProductosPorAlmacenPieChart(
  codigoAlmacen,
  accessToken
) {
  const response = await fetch(
    `${API_URL}/stock/almacen/${codigoAlmacen}/detalle`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener productos del almacén");
  }

  const data = await response.json();
  return data;
}

export async function getHistorialProducto(
  codigoProducto,
  accessToken,
  limit = 10,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/stock/producto/${codigoProducto}/historial?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener historial del producto");
  }

  const data = await response.json();

  return data;
}

export async function getHistorialProductoPorAlmacen(
  codAlmacen,
  codProducto,
  accessToken,
  limit = 100,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/stock/almacen/${codAlmacen}/producto/${codProducto}/historial?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener historial del producto");
  }

  const data = await response.json();
  return data;
}

export async function getStockPorProducto(
  codigoProducto,
  accessToken,
  limit = 10,
  offset = 0
) {
  const url = new URL(
    `${API_URL}/stock/producto/${codigoProducto}?limit=${limit}&offset${offset}`
  );
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el stock del producto");
  }

  const data = await response.json();
  return data;
}

export async function getStockPorCategoria(accessToken) {
  const res = await fetch(`${API_URL}/stock/categorias-producto`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener el stock por categoría");
  }

  return await res.json();
}

export async function getProductosPorCategoria(idCategoria, accessToken) {
  const res = await fetch(
    `${API_URL}/stock/categoria/${idCategoria}/productos`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo obtener el stock por producto en la categoría");
  }

  return await res.json();
}

export async function getStockProductoPorAlmacen(
  codigoAlmacen,
  codigoProducto,
  accessToken,
  limit = 10,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/stock/almacen/${codigoAlmacen}/producto/${codigoProducto}?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Error al obtener el stock del producto en el almacén"
    );
  }

  return await response.json();
}

export async function getStockPorAlmacen(
  codigoAlmacen,
  accessToken,
  limit = 10,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/stock/almacen/${codigoAlmacen}?limit=${limit}&offset${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el stock del almacén");
  }

  const data = await response.json();
  return data;
}

export async function getHistorialAlmacen(
  codigoAlmacen,
  accessToken,
  limit = 100,
  offset = 0
) {
  const response = await fetch(
    `${API_URL}/stock/almacen/${codigoAlmacen}/historial?limit=${limit}&offset${offset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Error al obtener el historial del almacén"
    );
  }

  const data = await response.json();
  return data;
}

export async function getLotesDisponibles({
  codigo_producto,
  codigo_almacen,
  accessToken,
}) {
  const response = await fetch(
    `${API_URL}/stock/lotes-disponibles?producto=${codigo_producto}&almacen=${codigo_almacen}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los lotes disponibles.");
  }

  return await response.json(); // Devuelve un array de { lote, fecha_cad, cantidad }
}

export async function getProductosCaducidad({ accessToken, desde, hasta, limit, offset }) {
  const url = new URL(`${API_URL}/stock/producto/caducidad`);
  url.searchParams.append("desde", desde);
  url.searchParams.append("hasta", hasta);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener productos por caducidad");
  }

  const data = await response.json();
  return data;
}