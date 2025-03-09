import API from "utils/api";

/**
 * 🔹 Obtener estadísticas de sentimiento de reseñas (Solo Superadmin)
 */
export const getReviewSentimentStatsService = async () => {
  try {
    const response = await API.get("/reviews/analytics/sentiment");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener estadísticas de sentimiento:", error);
    throw error;
  }
};

/**
 * 🔹 Obtener el promedio de calificaciones (Superadmin y Managers)
 * @param groupBy - Puede ser "restaurant" o "user"
 */
export const getAverageReviewService = async (groupBy?: string) => {
  try {
    const url = groupBy ? `/reviews/analytics/average-ratings?groupBy=${groupBy}` : "/reviews/analytics/average-ratings";
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener promedio de calificaciones:", error);
    throw error;
  }
};

/**
 * 🔹 Obtener reseñas reportadas (Superadmin y Managers)
 */
export const getReportedReviewsService = async () => {
  try {
    const response = await API.get("/reviews/analytics/reported");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reseñas reportadas:", error);
    throw error;
  }
};
