import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";

// Diccionario principal: ruta -> nombre amigable para mostrar en breadcrumb
const breadcrumbNameMap = {
  "/dashboard": "Dashboard",

  // Productos
  "/productos": "Productos",
  "/productos/listado": "Listado de productos",
  "/productos/nuevo": "Nuevo producto",
  "/productos/:id": "Detalle de producto",
  "/productos/:id/editar": "Editar producto",
  "/productos/:id/stock": "Stock del producto",
  "/productos/:id/historial": "Histórico de stock del producto",

  // Caducidad
  "/caducidad": "Productos próximos a caducar",

  // Categorías
  "/categorias": "Gestión de categorías",

  // Almacenes
  "/almacenes": "Almacenes",
  "/almacenes/listado": "Listado de almacenes",
  "/almacenes/nuevo": "Nuevo almacén",
  "/almacenes/:codigo": "Detalle de almacén",
  "/almacenes/:codigo/editar": "Editar almacén",

  // Stock por almacén
  "/stock/almacen/:codigo_almacen": "Stock por almacén",
  "/stock/almacen/:codigo_almacen/producto/:codigo_producto":
    "Stock del producto en almacén",
  "/stock/almacen/:codigo_almacen/historial": "Histórico de stock del almacén",
  "/stock/almacen/:id_almacen/productos/:id_producto/historial":
    "Histórico del producto en almacén",

  // Movimientos
  "/movimientos": "Movimientos",
  "/movimientos/listado": "Listado de movimientos",
  "/movimientos/nuevo": "Nuevo movimiento",
  "/movimientos/:id": "Detalle del movimiento",

  // Usuarios
  "/usuarios": "Usuarios",
  "/usuarios/nuevo": "Nuevo usuario",
  "/usuarios/:id/editar": "Editar usuario",

  // Perfil
  "/perfil": "Perfil de usuario",
};

// Overrides manuales: para rutas que no reflejan bien el contexto (como stock sin jerarquía clara)
const breadcrumbOverrides = {
  "/stock/almacen/:codigo_almacen": [
    { path: "/almacenes", label: "Almacenes" },
    { path: "/almacenes/listado", label: "Listado de almacenes" },
    { path: null, label: "Stock por almacén" }, // ruta actual (sin enlace)
  ],
  "/stock/almacen/:codigo_almacen/producto/:codigo_producto": [
    { path: "/productos", label: "Productos" },
    { path: null, label: "Stock del producto en almacén" },
  ],
};

// Busca si la ruta actual coincide con algún override
const matchOverride = (pathname) => {
  for (const pattern in breadcrumbOverrides) {
    const regex = new RegExp(
      "^" + pattern.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/") + "$"
    );
    if (regex.test(pathname)) return breadcrumbOverrides[pattern];
  }
  return null;
};

// Encuentra una coincidencia con rutas dinámicas en breadcrumbNameMap
const getBreadcrumbLabel = (path) => {
  for (const pattern in breadcrumbNameMap) {
    const regex = new RegExp(
      "^" + pattern.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/") + "$"
    );
    if (regex.test(path)) return breadcrumbNameMap[pattern];
  }
  return null;
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Si la ruta tiene override, lo usamos
  const override = matchOverride(pathname);
  const items = [];

  if (override) {
    // Si hay override, lo usamos tal cual
    override.forEach((item, index) => {
      items.push({
        path: item.path,
        label: item.label,
        isLast: index === override.length - 1,
      });
    });
  } else {
    // Si no hay override, construimos el breadcrumb desde los segmentos reales de la ruta
    const segments = pathname.split("/").filter(Boolean);
    let pathAccumulator = "";

    segments.forEach((segment, index) => {
      pathAccumulator += `/${segment}`;
      const label = getBreadcrumbLabel(pathAccumulator);
      if (label) {
        items.push({
          path: pathAccumulator,
          label,
          isLast: index === segments.length - 1,
        });
      }
    });
  }

  return (
    <Breadcrumbs className="bg-white px-4 py-2">
      {/* Primer ítem: siempre es el inicio */}
      <Link to="/dashboard" className="opacity-60 flex items-center gap-1 mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Inicio
      </Link>

      {/* Resto de items: enlaces o texto plano según si es el último */}
      {items.map(({ path, label, isLast }) =>
        isLast || !path ? (
          <span key={label}>{label}</span>
        ) : (
          <Link key={path} to={path} className="opacity-60">
            {label}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
