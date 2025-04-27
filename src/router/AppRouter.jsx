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

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/productos"
        element={
          <PrivateRoute>
            <Productos />
          </PrivateRoute>
        }
      />

      <Route
        path="/movimientos"
        element={
          <PrivateRoute>
            <Movimientos />
          </PrivateRoute>
        }
      />

      <Route
        path="/almacenes"
        element={
          <PrivateRoute>
            <Almacenes />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <AdminRoute>
            <Usuarios />
          </AdminRoute>
        }
      />

      <Route
        path="/usuarios/nuevo"
        element={
          <AdminRoute>
            <NuevoUsuario />
          </AdminRoute>
        }
      />

      <Route
        path="/usuarios/:id/editar"
        element={
          <AdminRoute>
            <EditarUsuario />
          </AdminRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      <Route
        path="/caducidad"
        element={
          <PrivateRoute>
            <StockProductoCaducidad />
          </PrivateRoute>
        }
      />

      <Route
        path="/movimientos/nuevo"
        element={
          <PrivateRoute>
            <CrearMovimiento />
          </PrivateRoute>
        }
      />

      <Route
        path="/movimientos/listado"
        element={
          <PrivateRoute>
            <ListadoMovimientos />
          </PrivateRoute>
        }
      />

      <Route
        path="/movimientos/:id"
        element={
          <PrivateRoute>
            <DetalleMovimiento />
          </PrivateRoute>
        }
      />

      <Route
        path="/productos/listado"
        element={
          <PrivateRoute>
            <ListadoProductos />
          </PrivateRoute>
        }
      />

      <Route
        path="/productos/:id"
        element={
          <PrivateRoute>
            <DetalleProducto />
          </PrivateRoute>
        }
      />

      <Route
        path="/productos/nuevo"
        element={
          <AdminRoute>
            <NuevoProducto />
          </AdminRoute>
        }
      />

      <Route
        path="/productos/:id/editar"
        element={
          <AdminRoute>
            <EditarProducto />
          </AdminRoute>
        }
      />

      <Route
        path="/productos/:id/stock"
        element={
          <PrivateRoute>
            <StockPorProducto />
          </PrivateRoute>
        }
      />

      <Route
        path="/productos/:id/historial"
        element={
          <PrivateRoute>
            <HistorialProducto />
          </PrivateRoute>
        }
      />

      <Route
        path="/stock/almacen/:id_almacen/productos/:id_producto/historial"
        element={
          <PrivateRoute>
            <HistorialProductoPorAlmacen />
          </PrivateRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <AdminRoute>
            <Categorias />
          </AdminRoute>
        }
      />

      <Route
        path="/almacenes/listado"
        element={
          <PrivateRoute>
            <ListadoAlmacenes />
          </PrivateRoute>
        }
      />

      <Route
        path="/almacenes/nuevo"
        element={
          <AdminRoute>
            <NuevoAlmacen />
          </AdminRoute>
        }
      />

      <Route
        path="/almacenes/:codigo"
        element={
          <PrivateRoute>
            <DetalleAlmacen />
          </PrivateRoute>
        }
      />

      <Route
        path="/almacenes/:codigo/editar"
        element={
          <PrivateRoute>
            <EditarAlmacen />
          </PrivateRoute>
        }
      />

      <Route
        path="/stock/almacen/:codigo_almacen/producto/:codigo_producto"
        element={
          <PrivateRoute>
            <StockProductoPorAlmacen />
          </PrivateRoute>
        }
      />

      <Route
        path="/stock/almacen/:codigo_almacen"
        element={
          <PrivateRoute>
            <StockPorAlmacen />
          </PrivateRoute>
        }
      />

      <Route
        path="/stock/almacen/:codigo_almacen/historial"
        element={
          <PrivateRoute>
            <HistorialStockAlmacen />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

// <PrivateRoute>: Es un wrapper para envolver los componentes que solo deberían verse si el usuario está autenticado.
