import API from "utils/api";

/**
 * Obtener todas las fotos de la galería de un restaurante
 * @param restaurantId ID del restaurante
 */
export const getRestaurantGalleryService = async (restaurantId: string) => {
  try {
    const response = await API.get(`/restaurants/${restaurantId}/gallery`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener la galería del restaurante:", error);
    throw error;
  }
};

/**
 * Agregar una nueva foto a la galería de un restaurante
 * @param restaurantId ID del restaurante
 * @param formData FormData con la imagen a subir
 */
export const addPhotoToGalleryService = async (restaurantId: string, formData: FormData) => {
  try {
    const response = await API.post(`/restaurants/${restaurantId}/gallery`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al subir la foto a la galería:", error);
    throw error;
  }
};

/**
 * Eliminar una foto de la galería de un restaurante
 * @param restaurantId ID del restaurante
 * @param photoUrl URL de la foto a eliminar
 */
export const removePhotoFromGalleryService = async (restaurantId: string, photoUrl: string) => {
  try {
    const response = await API.delete(`/restaurants/${restaurantId}/gallery`, {
      data: { photoUrl },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar la foto de la galería:", error);
    throw error;
  }
};
