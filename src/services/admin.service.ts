import { IUser } from "@delatte/shared/interfaces";
import axios from "axios";
import API from "utils/api";
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

export const updateUserService = async (userId: string,updatedData: Partial<IUser>) => {
  try {
    const response = await API.put(`/admin/${userId}/update`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error en updateUserDataService:", error);
    throw new Error("Error al actualizar los datos del usuario");
  }
};

export const getUserDetailsService = async (userId: string) => {
  try {
    const response = await API.get(`/admin/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error en getUserDetailsService:", error);
    throw new Error("Error al obtener los datos del usuario");
  }
};

export const getUserByIDService = async (userId : string) => {
  try {
    const response = await API.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw error;
  }
};

