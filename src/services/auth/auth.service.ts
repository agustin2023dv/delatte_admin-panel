import API from "utils/api";

/**
 * Iniciar sesión como administrador
 * @param email Email del admin
 * @param password Contraseña del admin
 */
export const loginAdminService = async (email: string, password: string) => {
  try {
    const response = await API.post("/admin/auth", { email, password });

    if (!response.data.token) {
      throw new Error("El servidor no devolvió un token.");
    }

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);

    console.log(`✅ Admin autenticado correctamente`);

    return { user, token };
  } catch (error) {
    console.error(`❌ Error en loginAdminService:`, error);
    throw error;
  }
};

/**
 * Cerrar sesión del administrador
 */
export const logoutAdminService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  console.log("🚪 Admin ha cerrado sesión.");
};

  