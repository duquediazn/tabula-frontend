import Papa from "papaparse";

export async function exportarCSVGenerico({
  accessToken,
  apiUrl,
  endpoint,
  queryParams = {},
  filename = "export.csv",
  mapFn,
}) {
  try {
    const url = new URL(`${apiUrl}${endpoint}`);
    for (const [key, value] of Object.entries(queryParams)) {
      if (
        value !== null &&
        value !== undefined &&
        !(typeof value === "string" && value.trim() === "")
      ) {
        url.searchParams.append(key, value);
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    const items = data.data || [];

    const csv = Papa.unparse(items.map(mapFn), { delimiter: ";" });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const urlBlob = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al exportar CSV:", error);
    alert("Hubo un error al exportar:\n" + error.message);
  }
}

export async function exportarMovimientosFiltradosCSV({
  accessToken,
  filtros,
  apiUrl,
}) {
  const queryParams = {
    limit: 1000,
    offset: 0,
  };

  if (filtros.searchTerm?.trim()) queryParams.search = filtros.searchTerm;
  if (filtros.tipoFiltro) queryParams.tipo = filtros.tipoFiltro;
  if (filtros.fechaDesde) queryParams.fecha_desde = filtros.fechaDesde;
  if (filtros.fechaHasta) queryParams.fecha_hasta = filtros.fechaHasta;
  if (filtros.usuarioFiltro) queryParams.usuario_id = filtros.usuarioFiltro;

  return exportarCSVGenerico({
    accessToken,
    apiUrl,
    endpoint: "/movimientos",
    queryParams,
    filename: "movimientos.csv",
    mapFn: (m) => ({
      ID: m.id_mov,
      Tipo: m.tipo,
      Usuario: m.nombre_usuario,
      Fecha: new Date(m.fecha).toLocaleDateString(),
      Lineas: m.lineas?.length ?? 0,
    }),
  });
}

export async function exportarProductosFiltradosCSV({
  accessToken,
  filtros,
  apiUrl,
}) {
  const queryParams = {
    limit: 1000,
    offset: 0,
  };

  if (filtros.searchTerm?.trim()) queryParams.search = filtros.searchTerm;
  if (filtros.id_categoria) queryParams.id_categoria = filtros.id_categoria;
  if (filtros.estado === "true" || filtros.estado === "false") {
    queryParams.estado = filtros.estado === "true";
  }

  return exportarCSVGenerico({
    accessToken,
    apiUrl,
    endpoint: "/productos",
    queryParams,
    filename: "productos.csv",
    mapFn: (p) => ({
      SKU: p.sku,
      Nombre: p.nombre_corto,
      Categoría: p.nombre_categoria,
      Estado: p.activo ? "Activo" : "Inactivo",
    }),
  });
}

export async function exportarAlmacenesFiltradosCSV({
  accessToken,
  apiUrl,
  filtros,
}) {
  const queryParams = {
    limit: 1000,
    offset: 0,
  };

  if (filtros.searchTerm?.trim()) queryParams.search = filtros.searchTerm;
  if (filtros.estado === "true" || filtros.estado === "false") {
    queryParams.estado = filtros.estado === "true";
  }

  return exportarCSVGenerico({
    accessToken,
    apiUrl,
    endpoint: "/almacenes",
    queryParams,
    filename: "almacenes.csv",
    mapFn: (a) => ({
      Código: a.codigo_almacen,
      Descripción: a.descripcion,
      Nombre: a.nombre_almacen,
      Estado: a.activo ? "Activo" : "Inactivo",
    }),
  });
}

export async function exportarUsuariosFiltradosCSV({
  accessToken,
  filtros,
  apiUrl,
}) {
  const queryParams = {
    limit: 1000,
    offset: 0,
  };

  if (filtros.estado === "true" || filtros.estado === "false") {
    queryParams.estado = filtros.estado === "true";
  }
  if (filtros.searchTerm?.trim()) {
    queryParams.search = filtros.searchTerm;
  }

  return exportarCSVGenerico({
    accessToken,
    apiUrl,
    endpoint: "/usuarios",
    queryParams,
    filename: "usuarios.csv",
    mapFn: (u) => ({
      ID: u.id,
      Nombre: u.nombre,
      Email: u.email,
      Rol: u.rol,
      Estado: u.activo ? "Activo" : "Inactivo",
    }),
  });
}
