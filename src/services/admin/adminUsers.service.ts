import { IUser } from "@delatte/shared/interfaces";
import API from "utils/api";

/**
 * 🔹 Actualizar datos de un usuario 
 * @param userId ID del usuario
 * @param updatedData Campos a actualizar 
 * @returns Usuario actualizado
 */
export const updateUserService = async (userId: string, updatedData: Partial<IUser>) => {
  try {
    const response = await API.put(`/admin/users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error en updateUserService:", error);
    throw new Error("Error al actualizar los datos del usuario.");
  }
};

/**
 * 🔹 Suspender un usuario 
 * @param userId ID del usuario
 * @returns Mensaje de éxito
 */
export const suspendUserService = async (userId: string) => {
  try {
    const response = await API.patch(`/admin/users/${userId}/suspension`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en suspendUserService:", error);
    throw new Error("No se pudo suspender al usuario.");
  }
};

/**
 * 🔹 Eliminar un usuario (Solo Superadmins)
 * @param userId ID del usuario
 * @returns Mensaje de éxito
 */
export const deleteUserService = async (userId: string) => {
  try {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en deleteUserService:", error);
    throw new Error("No se pudo eliminar al usuario.");
  }
};
