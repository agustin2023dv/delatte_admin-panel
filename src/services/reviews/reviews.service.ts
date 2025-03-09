import API from "utils/api";

/**
 * 🔹 Obtener todas las reseñas (Solo Superadmins)
 */
export const getAllReviewsService = async () => {
  try {
    const response = await API.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener todas las reseñas:", error);
    throw error;
  }
};

/**
 * 🔹 Obtener reseñas de un restaurante
 */
export const getReviewsByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await API.get(`/restaurants/${restaurantId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reseñas del restaurante:", error);
    throw error;
  }
};

/**
 * 🔹 Obtener reseñas de un usuario
 */
export const getReviewsByUserService = async (userId: string) => {
  try {
    const response = await API.get(`/users/${userId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reseñas del usuario:", error);
    throw error;
  }
};

/**
 * 🔹 Eliminar una reseña (Admin puede eliminar cualquier reseña)
 */
export const deleteReviewService = async (reviewId: string) => {
  try {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar la reseña:", error);
    throw error;
  }
};
