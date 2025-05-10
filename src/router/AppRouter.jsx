import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Productos from "../pages/Productos";
import Movimientos from "../pages/Movimientos";
import Almacenes from "../pages/Almacenes";
import Usuarios from "../pages/Usuarios";
import Perfil from "../pages/Perfil";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import StockProductoCaducidad from "../pages/StockProductoCaducidad";
import CrearMovimiento from "../pages/CrearMovimiento";
import ListadoMovimientos from "../pages/ListadoMovimiento";
import DetalleMovimiento from "../pages/DetalleMovimiento";
import ListadoProductos from "../pages/ListadoProductos";
import DetalleProducto from "../pages/DetalleProducto";
import AdminRoute from "./AdminRoute";
import NuevoProducto from "../pages/NuevoProducto";
import EditarProducto from "../pages/EditarProducto";
import StockPorProducto from "../pages/StockPorProducto";
import HistorialProducto from "../pages/HistorialProducto";
import Categorias from "../pages/Categorias";
import ListadoAlmacenes from "../pages/ListadoAlmacenes";
import NuevoAlmacen from "../pages/NuevoAlmacen";
import DetalleAlmacen from "../pages/DetalleAlmacen";
import EditarAlmacen from "../pages/EditarAlmacen";
import StockProductoPorAlmacen from "../pages/StockProductoPorAlmacen";
import StockPorAlmacen from "../pages/StockPorAlmacen";
import HistorialStockAlmacen from "../pages/HistorialStockAlmacen";
import HistorialProductoPorAlmacen from "../pages/HistorialProductoPorAlmacen";
import NuevoUsuario from "../pages/NuevoUsuario";
import EditarUsuario from "../pages/EditarUsuario";

/*
Routes, Route: vienen de react-router-dom, y permiten declarar las rutas (como en un switch-case).
Navigate: sirve para redirigir de una ruta a otra.
*/

export default function AppRouter() {
  return (
    //Dentro de <Routes>, se colocan los <Route> que representan las distintas páginas.
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/nuevo" element={<NuevoUsuario />} />
        <Route path="/usuarios/:id/editar" element={<EditarUsuario />} />
        <Route path="/productos/nuevo" element={<NuevoProducto />} />
        <Route path="/productos/:id/editar" element={<EditarProducto />} />
        <Route path="/almacenes/nuevo" element={<NuevoAlmacen />} />
        <Route path="/almacenes/:codigo/editar" element={<EditarAlmacen />} />
        <Route path="/categorias" element={<Categorias />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/almacenes" element={<Almacenes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/caducidad" element={<StockProductoCaducidad />} />
        <Route path="/movimientos/nuevo" element={<CrearMovimiento />} />
        <Route path="/movimientos/listado" element={<ListadoMovimientos />} />
        <Route path="/movimientos/:id" element={<DetalleMovimiento />} />
        <Route path="/productos/listado" element={<ListadoProductos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/productos/:id/stock" element={<StockPorProducto />} />
        <Route
          path="/productos/:id/historial"
          element={<HistorialProducto />}
        />
        <Route
          path="/stock/almacen/:id_almacen/productos/:id_producto/historial"
          element={<HistorialProductoPorAlmacen />}
        />
        <Route path="/almacenes/listado" element={<ListadoAlmacenes />} />
        <Route path="/almacenes/:codigo" element={<DetalleAlmacen />} />
        <Route
          path="/stock/almacen/:codigo_almacen/producto/:codigo_producto"
          element={<StockProductoPorAlmacen />}
        />
        <Route
          path="/stock/almacen/:codigo_almacen"
          element={<StockPorAlmacen />}
        />
        <Route
          path="/stock/almacen/:codigo_almacen/historial"
          element={<HistorialStockAlmacen />}
        />
      </Route>
    </Routes>
  );
}
