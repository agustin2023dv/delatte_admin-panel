import API from "utils/api";

/**
 * 🔹 Obtener todos los usuarios (Solo Superadmins)
 * @returns Lista de usuarios [{ id, nombre, email, estado, rol }]
 */
export const getUsersService = async () => {
  try {
    const response = await API.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("❌ Error en getUsersService:", error);
    throw new Error("No se pudo obtener la lista de usuarios.");
  }
};

/**
 * 🔹 Obtener detalles de un usuario por ID
 * @param userId ID del usuario
 * @returns Datos del usuario { id, nombre, email, estado, rol, createdAt, updatedAt }
 */
export const getUserDetailsService = async (userId: string) => {
  try {
    const response = await API.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en getUserDetailsService:", error);
    throw new Error("No se pudo obtener la información del usuario.");
  }
};
