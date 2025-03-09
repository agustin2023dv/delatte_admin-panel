import { IReservation } from "@delatte/shared/interfaces";
import API from "utils/api";

/**
 * 📝 Crear una nueva reserva
 */
export const createReservationService = async (reservationData: Partial<IReservation>) => {
  try {
    const response = await API.post("/reservations", reservationData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la reserva:", error);
    throw error;
  }
};

/**
 * 📝 Obtener todas las reservas (solo superadmins)
 */
export const getAllReservationsService = async () => {
  try {
    const response = await API.get("/reservations/all");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener todas las reservas:", error);
    throw error;
  }
};

/**
 * 📝 Obtener reservas por restaurante
 */
export const getReservationsByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await API.get(`/reservations/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener las reservas del restaurante:", error);
    throw error;
  }
};

/**
 * 📝 Obtener reservas de un usuario (solo superadmins)
 */
export const getReservationsByUserService = async (userId: string) => {
  try {
    const response = await API.get(`/reservations/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener las reservas del usuario:", error);
    throw error;
  }
};

/**
 * 📝 Obtener una reserva por ID
 */
export const getReservationByIdService = async (reservationId: string) => {
  try {
    const response = await API.get(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener la reserva por ID:", error);
    throw error;
  }
};

/**
 * 📝 Cancelar una reserva
 */
export const cancelReservationService = async (reservationId: string) => {
  try {
    const response = await API.put(`/reservations/${reservationId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al cancelar la reserva:", error);
    throw error;
  }
};

/**
 * 📝 Modificar una reserva
 */
export const modifyReservationService = async (reservationId: string, updatedData: Partial<IReservation>) => {
  try {
    const response = await API.put(`/reservations/${reservationId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al modificar la reserva:", error);
    throw error;
  }
};

/**
 * 📝 Obtener reservas del usuario autenticado
 */
export const getUserReservationsService = async () => {
  try {
    const response = await API.get(`/reservations`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reservas del usuario autenticado:", error);
    throw new Error("No se pudieron cargar las reservas del usuario.");
  }
};
