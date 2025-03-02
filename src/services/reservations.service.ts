
import { IReservation } from "@delatte/shared/interfaces";
import API from "utils/api";


export const getReservationsByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await API.get(`/reservas/restaurant/${restaurantId}`)
    return response.data; 
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
      throw error;
  }
} 

export const getReservationByIdService = async (reservationId: string)=> {
 
    try {
      const response = await API.get(`/reservas/${reservationId}`)
      return response.data; 
    } catch (error) {
      console.error('Error al obtener la reserva por ID:', error);
      throw error;
    }
  };
  
  // Crear una nueva reserva
  export const createReservationService = async (
    reservationData: {
      restaurante: string;
      fecha: string;
      horario: string;
      numAdultos: number;
      numNinos: number;
      pedidosEspeciales?: string;
    }
  ) => {
    try {
      const response = await API.post(
        `/reservas/create-reservation`,
        reservationData,
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      throw error;
    }
  };
  
  // Cancelar una reserva
  export const cancelReservationService = async (reservationId: string)=> {
    try {
      const response = await API.put(
        `/reservas/cancelar/${reservationId}`,
      );
      return response.data; 
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      throw error;
    }
  };
  
  // Modificar una reserva
  export const modifyReservationService = async (
    reservationId: string,
    updatedData: Partial<IReservation>
  )=> {
    try {
      const response = await API.put(
        `/reservas/modificar/${reservationId}`,
        updatedData,
      );
      return response.data; 
    } catch (error) {
      console.error('Error al modificar la reserva:', error);
      throw error;
    }
  };
  

  export const getUserReservationsService = async (userId: string) => {
    try {
      const response = await API.get(`/reservas/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reservas del usuario:", error);
      throw new Error("No se pudieron cargar las reservas del usuario.");
    }
  };
