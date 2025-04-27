export function mostrarResumenEstado(
  res,
  tipo = "elementos",
  accion = "actualizar"
) {
  const mensaje =
    res.mensaje || `${res.actualizados?.length || 0} ${tipo} ${accion}`;
  const omitidos = res.omitidos || 0;

  if (omitidos > 0) {
    alert(`${mensaje}.\n${omitidos} ${tipo} fueron omitidos.`);
  } else {
    alert(mensaje);
  }
}
