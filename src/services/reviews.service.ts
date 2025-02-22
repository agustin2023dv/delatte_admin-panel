import API from "utils/api";



export const getReviewsByRestaurantService = async (restaurantId: string) => {
    try {
      const response = await API.get(`/restaurantes/${restaurantId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reviews:", error);
      throw error;
    }
  };