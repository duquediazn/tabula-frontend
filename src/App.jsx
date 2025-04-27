import AppRouter from "./router/AppRouter";

/*
Dentro de este contenedor se renderiza <AppRouter />, lo que significa que TODO 
lo que se renderiza en la app depende de las rutas definidas ahí.
*/

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppRouter />
    </div>
  );
}

export default App;
