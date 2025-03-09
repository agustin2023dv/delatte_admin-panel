import { IRestaurant } from "@delatte/shared/interfaces";
import API from "utils/api";

/**
 * Obtener todos los restaurantes
 */
export const getAllRestaurantsService = async () => {
  try {
    const response = await API.get("/restaurants");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurantes:", error);
    throw error;
  }
};

/**
 * Obtener restaurante por ID
 */
export const getRestaurantByIdService = async (restaurantId: string) => {
  try {
    const response = await API.get(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurante por ID:", error);
    throw error;
  }
};

/**
 * Crear un nuevo restaurante 
 */
export const createRestaurantService = async (restaurantData: Partial<IRestaurant>) => {
  try {
    const response = await API.post("/restaurants", restaurantData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear restaurante:", error);
    throw error;
  }
};

/**
 * Actualizar un restaurante
 */
export const updateRestaurantService = async (
  restaurantId: string,
  updateData: Partial<IRestaurant>
) => {
  try {
    const response = await API.put(`/restaurants/${restaurantId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar restaurante:", error);
    throw error;
  }
};

/**
 * Obtener restaurantes gestionados por un manager 
 */
export const getRestaurantsByManagerIdService = async (managerId: string) => {
  try {
    const response = await API.get(`/restaurants/managers/${managerId}/restaurants`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurantes del manager:", error);
    throw error;
  }
};
