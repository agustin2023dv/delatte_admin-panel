import {IUser,IReview,IRestaurant,IReservation}
 from "@delatte/shared/interfaces"
import axios from "axios";


const API_BASE_URL = "http://localhost:8081/api/admin";

const API_RESTAURANTS_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/restaurantes`
  : "http://localhost:8081/api/restaurantes"; 

  const API_RESERVATIONS_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/reservas`
  : "http://localhost:8081/api/reservas"; 
  const API_REVIEWS_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/reviews`
  : "http://localhost:8081/api/reviews";
// **Servicio para iniciar sesión como Admin**
export const loginAdminService = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login-admin`, {
      email,
      password,
    });
    return response.data; // Retornar token y usuario
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error) ? error.response?.data?.message || "Error en el login" : "Error inesperado"
    );
  }
};

// **Obtener lista de usuarios con filtro opcional por rol**
export const getUsersService = async (role?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      params: role ? { role } : {},
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudieron obtener los usuarios");
  }
};

// **Obtener detalles de un usuario**
export const getUserDetailsService = async (userId: string) => {
  if (!userId || typeof userId !== "string") throw new Error("ID de usuario no válido");

  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudieron obtener los detalles del usuario");
  }
};

// **Suspender un usuario por ID**
export const suspendUserService = async (userId: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${userId}/suspend`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo suspender el usuario");
  }
};

// **Eliminar un usuario por ID**
export const deleteUserService = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo eliminar el usuario");
  }
};

// **Actualizar datos de un usuario por ID**
export const updateUserService = async (userId: string, userData: Partial<IUser>) => {
  try {
    // Evita que se envíe `emailToken`
    const { emailToken, ...filteredUserData } = userData;

    const response = await axios.put(`${API_BASE_URL}/${userId}`, filteredUserData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    throw new Error("No se pudo actualizar el usuario");
  }
};

export const getAllRestaurantsService = async () => {
  try {
    const response = await axios.get(`${API_RESTAURANTS_URL}/`);
    return response.data as IRestaurant[];
  } catch (error) {
    console.error("❌ Error en getAllRestaurantsService:", error);
    throw new Error("No se pudieron obtener los restaurantes");
  }
};

export const getRestaurantByIdService = async (restaurantId: string) => {
  try {
    const response = await axios.get(`${API_RESTAURANTS_URL}/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener restaurante por ID:", error);
    throw error;
  }
};

// 🔹 **Obtener todas las reseñas (con paginación)**
export const getAllReviewsService = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_REVIEWS_URL}/all`, {
      params: { page, limit },
    });
    return response.data as IReview[];
  } catch (error) {
    console.error("❌ Error en getAllReviewsService:", error);
    throw new Error("No se pudieron obtener las reseñas");
  }
};

// 🔹 **Obtener reseñas de un restaurante**
export const getReviewsByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await axios.get(`${API_REVIEWS_URL}/restaurant/${restaurantId}`);
    return response.data as IReview[];
  } catch (error) {
    console.error("❌ Error en getReviewsByRestaurantService:", error);
    throw new Error("No se pudieron obtener las reseñas del restaurante");
  }
};

// 🔹 **Obtener reseñas de un usuario**
export const getReviewsByUserService = async (userId: string) => {
  try {
    const response = await axios.get(`${API_REVIEWS_URL}/user/${userId}`);
    return response.data as IReview[];
  } catch (error) {
    console.error("❌ Error en getReviewsByUserService:", error);
    throw new Error("No se pudieron obtener las reseñas del usuario");
  }
};

// 🔹 **Eliminar una reseña (Solo Superadmin puede eliminar cualquier reseña)**
export const deleteReviewService = async (reviewId: string) => {
  try {
    const response = await axios.delete(`${API_REVIEWS_URL}/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en deleteReviewService:", error);
    throw new Error("No se pudo eliminar la reseña");
  }
};

// 🔹 **Obtener TODAS las reservas (Solo Superadmin)**
export const getAllReservationsService = async () => {
  try {
    const response = await axios.get(`${API_RESERVATIONS_URL}/all-reservations`);
    return response.data as IReservation[];
  } catch (error) {
    console.error("❌ Error en getAllReservationsService:", error);
    throw new Error("No se pudieron obtener todas las reservas.");
  }
};

// 🔹 **Obtener reservas de un USUARIO**
export const getReservationsByUserService = async (userId: string) => {
  try {
    const response = await axios.get(`${API_RESERVATIONS_URL}/user/${userId}`);
    return response.data as IReservation[];
  } catch (error) {
    console.error("❌ Error en getReservationsByUserService:", error);
    throw new Error("No se pudieron obtener las reservas del usuario.");
  }
};

// 🔹 **Obtener reservas de un RESTAURANTE**
export const getReservationsByRestaurantService = async (restaurantId: string) => {
  try {
    const response = await axios.get(`${API_RESERVATIONS_URL}/restaurant/${restaurantId}`);
    return response.data as IReservation[];
  } catch (error) {
    console.error("❌ Error en getReservationsByRestaurantService:", error);
    throw new Error("No se pudieron obtener las reservas del restaurante.");
  }
};

// 🔹 **Obtener una RESERVA por ID**
export const getReservationByIdService = async (reservationId: string) => {
  try {
    const response = await axios.get(`${API_RESERVATIONS_URL}/${reservationId}`);
    return response.data as IReservation;
  } catch (error) {
    console.error("❌ Error en getReservationByIdService:", error);
    throw new Error("No se pudo obtener la reserva.");
  }
};

// 🔹 **Cancelar una reserva**
export const cancelReservationService = async (reservationId: string) => {
  try {
    const response = await axios.put(`${API_RESERVATIONS_URL}/cancelar/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error en cancelReservationService:", error);
    throw new Error("No se pudo cancelar la reserva.");
  }
};

// 🔹 **Modificar una reserva**
export const updateReservationService = async (
  reservationId: string,
  updatedData: Partial<IReservation>
) => {
  try {
    const response = await axios.put(`${API_RESERVATIONS_URL}/modificar/${reservationId}`, updatedData);
    return response.data as IReservation;
  } catch (error) {
    console.error("❌ Error en updateReservationService:", error);
    throw new Error("No se pudo modificar la reserva.");
  }
};

export const updateRestaurantService = async (
  restaurantId: string,
  updateData: Partial<IRestaurant>
) => {
  try {
    const response = await axios.put(`${API_RESTAURANTS_URL}/${restaurantId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el restaurante:", error);
    throw new Error("No se pudo actualizar el restaurante");
  }
};