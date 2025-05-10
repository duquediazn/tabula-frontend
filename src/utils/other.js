//Genera colores dinámicamente
export function generarColores(n) {
    const colores = [];
    for (let i = 0; i < n; i++) {
        const hue = (i * 360) / n;
        colores.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colores;
}