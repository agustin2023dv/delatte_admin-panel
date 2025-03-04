import API from "utils/api";


export const getAllReviewsService = async()=> {
  try {
    const response = await API.get(`/resenas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener reviews:", error);
    throw error;
  }
}
export const getReviewsByRestaurantService = async (restaurantId: string) => {
    try {
      const response = await API.get(`/resenas/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reviews:", error);
      throw error;
    }
  };

  export const getReviewsByUserService = async (userId: string) => {
    try {
      const response = await API.get(`/resenas/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reviews:", error);
      throw error;
    }
  };

  export const getReviewByIdService = async (id: string) => {
    try {
      const response = await API.get(`/resenas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reviews:", error);
      throw error;
    }
  };

export const deleteReviewByIdService = async (reviewId: string) => {
  try {
    await API.delete(`/resenas/${reviewId}/delete`);
    return true;
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    throw new Error("No se pudo eliminar la reseña.");
  }
};
