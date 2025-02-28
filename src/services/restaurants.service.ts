import { IRestaurant } from "@delatte/shared/interfaces";
import API from "utils/api";

export const getAllRestaurantsService = async () => {
   try{const response = await API.get("/restaurantes");

    return response.data;
   }    
   catch(error){
        console.error("error: ",error);
        throw error
        }
   }
   export const getRestaurantByIdService = async (restaurantId: string) => {
    try {
      const response = await API.get(`/restaurantes/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener restaurante por ID:", error);
      throw error;
    }
  };

  export const updateRestaurantService = async (
    restaurantId: string,
    updateData: Partial<IRestaurant>
  ) => {
    try {
      const response = await API.put(`/restaurantes/${restaurantId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el restaurante:", error);
      throw new Error("No se pudo actualizar el restaurante");
    }
  };