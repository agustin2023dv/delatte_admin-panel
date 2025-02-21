"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { IReservation, IRestaurant, IReview } from "@delatte/shared/interfaces";
import { getReservationsByRestaurantService, 
  getRestaurantByIdService, getReviewsByRestaurantService, 
  updateRestaurantService } from "../../../../../admin.service";

const RestaurantDetails = () => {
  const params = useParams(); 
  const restaurantId = params.restaurant as string; 

  const [restaurantDetails, setRestaurantDetails] = useState<IRestaurant | null>(null);
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedRestaurant, setUpdatedRestaurant] = useState<Partial<IRestaurant>>({});

  useEffect(() => {
    if (!restaurantId) return;

    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [restaurantData, reservationsData, reviewsData] = await Promise.all([
          getRestaurantByIdService(restaurantId),
          getReservationsByRestaurantService(restaurantId),
          getReviewsByRestaurantService(restaurantId),
        ]);

        setRestaurantDetails(restaurantData);
        setReservations(reservationsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("❌ Error al obtener detalles del restaurante:", error);
        setError("Hubo un problema al cargar los datos del restaurante.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleInputChange = (field: keyof IRestaurant, value: string) => {
    setUpdatedRestaurant({ ...updatedRestaurant, [field]: value });
  };

  const handleUpdateRestaurant = async () => {
    try {
      if (!restaurantDetails?._id) return;
      const updatedData = await updateRestaurantService(restaurantDetails._id.toString()
        , updatedRestaurant);
      setRestaurantDetails(updatedData);
      setEditMode(false);
    } catch (error) {
      console.error("❌ Error al actualizar el restaurante:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Detalles del Restaurante</h1>

      {loading ? (
        <p>Cargando detalles...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : restaurantDetails ? (
        <div>
          <Image 
            src={restaurantDetails.logo} 
            alt="Logo del restaurante" 
            width={100} 
            height={100} 
          />

          {!editMode ? (
            <>
              <h2>{restaurantDetails.nombre}</h2>
              <p><strong>Ubicación:</strong> {restaurantDetails.direccion}, {restaurantDetails.localidad}, {restaurantDetails.pais}</p>
              <p><strong>Código Postal:</strong> {restaurantDetails.codigoPostal || "No disponible"}</p>
              <p><strong>Calificación:</strong> {restaurantDetails.calificacion} ⭐</p>
              <p><strong>Descripción:</strong> {restaurantDetails.descripcion || "No disponible"}</p>
              <p><strong>Contacto:</strong> {restaurantDetails.emailContacto} | 📞 {restaurantDetails.telefono || "No disponible"}</p>
              <button onClick={() => setEditMode(true)}>Editar</button>
            </>
          ) : (
            <>
              <input
                type="text"
                defaultValue={restaurantDetails.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
              />
              <input
                type="text"
                defaultValue={restaurantDetails.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
              />
              <input
                type="text"
                defaultValue={restaurantDetails.localidad}
                onChange={(e) => handleInputChange("localidad", e.target.value)}
              />
              <input
                type="text"
                defaultValue={restaurantDetails.pais}
                onChange={(e) => handleInputChange("pais", e.target.value)}
              />
              <input
                type="text"
                defaultValue={restaurantDetails.telefono || ""}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
              />
              <input
                type="email"
                defaultValue={restaurantDetails.emailContacto}
                onChange={(e) => handleInputChange("emailContacto", e.target.value)}
              />
              <button onClick={handleUpdateRestaurant}>Guardar Cambios</button>
              <button onClick={() => setEditMode(false)}>Cancelar</button>
            </>
          )}

          <h3>📷 Galería de Fotos</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {restaurantDetails.galeriaFotos?.length > 0 ? (
              restaurantDetails.galeriaFotos.map((foto, index) => (
                <Image key={index} src={foto} alt={`Foto ${index}`} width={100} height={100} />
              ))
            ) : (
              <p>No hay fotos disponibles.</p>
            )}
          </div>

          <h3>📅 Horarios</h3>
          <ul>
            {restaurantDetails.horarios?.length > 0 ? (
              restaurantDetails.horarios.map((horario, index) => (
                <li key={index}>{horario.dia}: {horario.horaApertura} - {horario.horaCierre}</li>
              ))
            ) : (
              <p>No hay horarios definidos.</p>
            )}
          </ul>

          <h3>📋 Capacidad de Mesas</h3>
          <ul>
            {restaurantDetails.capacidadMesas?.length > 0 ? (
              restaurantDetails.capacidadMesas.map((mesa, index) => (
                <li key={index}>{mesa.cantidad} mesas de {mesa.personasPorMesa} personas</li>
              ))
            ) : (
              <p>No hay información sobre la capacidad de mesas.</p>
            )}
          </ul>

          <h2>📌 Reservas</h2>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reserva) => (
                <li key={reserva._id.toString()}>
                  <p><strong>Fecha:</strong> {new Intl.DateTimeFormat("es-ES").format(new Date(reserva.fecha))}</p>
                  <p>Horario:{reserva.horario}</p>
                  <p><strong>Cliente:</strong> 
              {typeof reserva.usuario !== "string" && "nombre" in reserva.usuario
                ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
                : "Usuario desconocido"}
                      </p>
                  <p><strong>Estado:</strong> {reserva.estado}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reservas disponibles.</p>
          )}

          <h2>📝 Reviews</h2>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={review._id.toString()}>
                  <p><strong>Usuario:</strong> 
                  {typeof review.usuario !== "string" && "nombre" in review.usuario
                    ? `${review.usuario.nombre} ${review.usuario.apellido}`
                    : "Usuario desconocido"}
                </p>
                  <p><strong>Calificación:</strong> {review.calificacion} ⭐</p>
                  <p><strong>Comentario:</strong> {review.comentario}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reviews disponibles.</p>
          )}
        </div>
      ) : (
        <p>No se encontraron detalles del restaurante.</p>
      )}
    </div>
  );
};

export default RestaurantDetails;
