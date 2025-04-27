# tabula-frontend

## Español

Frontend del sistema Tábula, una aplicación de gestión de inventario con paneles visuales y control en tiempo real, desarrollada con React, Vite y Tailwind CSS.

Este repositorio contiene la interfaz de usuario, la lógica de autenticación, la navegación y el consumo de la API RESTful del backend.

---

## Navegación

- [Repositorio principal](https://github.com/duquediazn/tabula)
- [Backend (FastAPI + PostgreSQL)](https://github.com/duquediazn/tabula-backend)
- [Frontend (React + Tailwind)](https://github.com/duquediazn/tabula-frontend)

---

## Tecnologías principales

- [React 19](https://react.dev/) (con [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/en/main)
- Gráficas con [Recharts](https://recharts.org/) (gráficas de stock)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context) para gestión de autenticación
- Gestión de sesión con JWT + Cookies HttpOnly

---

## Instalación local

1. Clona el repositorio:

```bash
git clone https://github.com/duquediazn/tabula-frontend.git
cd tabula-frontend

```

2. Instala las dependencias:

```bash
npm install

```

3. Crea un archivo .env basado en el archivo de ejemplo:


```bash
cp .env.template .env

```

4. Configura la URL de la API en el .env:

```bash
VITE_API_URL=http://localhost:8000
```

5. Corre la aplicación en modo desarrollo:


```bash
npm run dev
```

6. Abre tu navegador en: 

- `http://localhost:5173`

---

##  Variables de entorno (.env)

La aplicación requiere definir la URL del backend para funcionar correctamente:

```bash
VITE_API_URL=http://localhost:8000
```

En producción, esta URL deberá apuntar al dominio donde esté desplegada la API.

---

## Contexto

Esta aplicación está diseñada para funcionar junto al backend disponible en [tabula-backend](https://github.com/duquediazn/tabula-backend).

Está preparada para entornos de desarrollo local y para despliegues en plataformas como Vercel.

---

## Licencia

Este proyecto está licenciado bajo los términos de la GNU General Public License v3.0.

Consulta el archivo LICENSE para más detalles.

---

> Este repositorio está basado en una versión previa desarrollada localmente, reorganizada y limpiada para su publicación pública.

---

## English

Frontend for the Tábula system, an inventory management application with visual dashboards and real-time control, developed using React, Vite, and Tailwind CSS.

This repository contains the user interface, authentication logic, navigation, and the consumption of the backend RESTful API.

--- 

## Navigation

- [Main repository (Documentation)](https://github.com/duquediazn/tabula)
- [Backend (FastAPI + PostgreSQL)](https://github.com/duquediazn/tabula-backend)
- [Frontend (React + Tailwind)](https://github.com/duquediazn/tabula-frontend)

---

## Main technologies

- [React 19](https://react.dev/) (with [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/en/main)
- Charts with [Recharts](https://recharts.org/) (stock graphs)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context) for authentication management
- Session management with JWT + HttpOnly Cookies

---

## Local installation

1. Clone the repository:

```bash
git clone https://github.com/duquediazn/tabula-frontend.git
cd tabula-frontend

```

2. Install the dependencies:

```bash
npm install

```

3. Create a .env file based on the example:


```bash
cp .env.template .env

```

4. Set the API URL in the .env file:

```bash
VITE_API_URL=http://localhost:8000
```

5. Run the application in development mode:


```bash
npm run dev
```

6. Open your browser at:

- `http://localhost:5173`

---

##  Environment variables (.env)

La aplicaciThe application requires setting the backend API URL to function correctly:

```bash
VITE_API_URL=http://localhost:8000
```

In production, this URL should point to the domain where the backend API is deployed.

---

## Contexto

This application is designed to work alongside the backend available at [tabula-backend](https://github.com/duquediazn/tabula-backend).

It is prepared for local development environments as well as deployments on platforms like Vercel.

---

## License

This project is licensed under the terms of the GNU General Public License v3.0.

See the LICENSE file for more details.

---


> This repository is based on a previous local development version, cleaned and restructured for public release.


