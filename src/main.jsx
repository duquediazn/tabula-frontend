import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; //Componente que permite manejar rutas de una manera parecida a cómo funcionan las URLs en una app tradicional.
//Es el "router" principal de React Router.
import { AuthProvider } from "./context/AuthProvider"; // Importa el contexto de autenticación, que crea un "estado global" para saber si el usuario
// está logueado, quién es, su token, etc. Cualquier parte de la app puede acceder a esos datos sin necesidad de pasarlos por props.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*
Este bloque envuelve la app con varios providers que le dan capacidades especiales:
* <React.StrictMode>: Modo estricto que ayuda a detectar errores potenciales en desarrollo. Solo afecta al entorno de desarrollo.
* <BrowserRouter>: Habilita el uso de rutas (<Route>, useNavigate, etc.) en toda la app.
* <AuthProvider>: Crea un "contexto" de autenticación que estará disponible en toda la app. Esto permite, por ejemplo, acceder 
al usuario actual en cualquier componente con useAuth().
* <App />: El componente principal donde se definen las rutas (<Routes>, <Route>, etc.).
*/
