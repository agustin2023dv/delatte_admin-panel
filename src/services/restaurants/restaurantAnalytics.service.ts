import API from "utils/api";

/**
 * Obtener los restaurantes con más reservas y mejores calificaciones
 */
export const getTopRestaurantsService = async () => {
  try {
    const response = await API.get("/restaurants/analytics/top");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los mejores restaurantes:", error);
    throw error;
  }
};

/**
 * Obtener los restaurantes con menor desempeño (menos reservas y calificaciones bajas)
 */
export const getWorstPerformingRestaurantsService = async () => {
  try {
    const response = await API.get("/restaurants/analytics/worst-performing");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurantes con menor desempeño:", error);
    throw error;
  }
};

/**
 * Obtener los restaurantes recién agregados
 */
export const getNewRestaurantsService = async () => {
  try {
    const response = await API.get("/restaurants/analytics/new");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los restaurantes nuevos:", error);
    throw error;
  }
};

/**
 * Obtener los restaurantes con alta ocupación y baja disponibilidad
 */
export const getSaturatedRestaurantsService = async () => {
  try {
    const response = await API.get("/restaurants/analytics/saturation");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurantes saturados:", error);
    throw error;
  }
};
