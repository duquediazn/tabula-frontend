import API_URL from "./config";

export async function login({ email, password }) {
  //Toma un objeto con email y password (backend espera username, como es típico en OAuth2,
  // nuestro username es el email).
  const formData = new URLSearchParams(); //Usamos URLSearchParams para construir el body del formulario como si fuera un x-www-form-urlencoded,
  // que es lo que espera FastAPI.
  formData.append("username", email); //Aquí email se manda como username porque FastAPI lo requiere así por defecto con OAuth2PasswordRequestForm.
  formData.append("password", password);

  //Se hace un POST al endpoint /auth/login, enviando los datos como un formulario.
  // La cabecera indica el tipo de contenido que espera el backend.
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: formData.toString(),
  });

  //Si el login falla (por ejemplo, credenciales inválidas), el backend manda un error y esto lanza una excepción con un mensaje amigable.
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  return await response.json(); //Devuelve el objeto { access_token, user_id, ... }
}

export async function register({ nombre, email, password }) {
  const response = await fetch(`${API_URL}/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nombre, email, passwd: password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error)); // serializamos el error para el frontend
  }

  return await response.json();
}

export async function verifyPassword(password, accessToken) {
  const response = await fetch(`${API_URL}/auth/verify-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al verificar la contraseña");
  }

  return await response.json(); // { message: "Contraseña válida" }
}

export async function getPerfil(accessToken) {
  const response = await fetch(`${API_URL}/auth/perfil`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al obtener el perfil");
  }

  return await response.json(); // { id, nombre, email, rol, activo }
}
