import API from "@/utils/api";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const loginUser = async (endpoint: string, email: string, password: string) => {
  try {
    const response = await API.post(endpoint, { email, password });

    // Verificar si el backend devolvió el token
    if (!response.data.token) {
      throw new Error("El servidor no devolvió un token.");
    }

    const { token, user } = response.data;
    const decodedUser = jwtDecode(token);

    // Guardar el token y datos en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);

    console.log(`✅ Usuario autenticado correctamente`);

    return { user: decodedUser, token };
  } catch (error) {
    console.error(`❌ Error en loginUser:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Error al iniciar sesión`
        : "Error inesperado"
    );
  }
};

// **Servicio para iniciar sesión como Admin**
export const loginAdminService = async (email: string, password: string) => {
  return await loginUser("/admin/login-admin", email, password);
};

export const getUsersService = async () => {
 const response = await API.get("/admin");
 return response.data;
}