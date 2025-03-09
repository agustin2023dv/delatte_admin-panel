"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image"; 
import { IRestaurant } from "@delatte/shared/interfaces";
import { getRestaurantByIdService } from "services/restaurants/restaurants.service";
import Slider from "react-slick"; 





export default function RestaurantDetails() {
  const { restaurant } = useParams();


  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurant) return;
      try {
        const data = await getRestaurantByIdService(restaurant as string);
        setRestaurantData(data);
      } catch (error) {
        setError("Error al obtener la información del restaurante.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurant]);

  if (loading) return <p>Cargando datos del restaurante...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!restaurantData) return <p>No se encontró el restaurante.</p>;





  // 📌 Configuración del carrusel
  const sliderSettings = {
    dots: true, // Muestra indicadores debajo del carrusel
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Muestra 1 imagen a la vez
    slidesToScroll: 1,
    autoplay: true, // Hace que pase automáticamente
    autoplaySpeed: 3000, // Cambia cada 3 segundos
    arrows: true, // Flechas de navegación
  };





  return (
    <div style={{ padding: "20px" }}>
      <h1>{restaurantData.nombre}</h1>

      <Image 
  src={
    restaurantData.logo && restaurantData.logo.startsWith("http") 
      ? restaurantData.logo 
      : "/default-restaurant.jpg"
  }
  alt={restaurantData.nombre} 
  width={600} 
  height={400}
  style={{ objectFit: "cover", borderRadius: "8px" }}
/>

      <p><strong>Dirección:</strong> {restaurantData.direccion}, {restaurantData.localidad}, {restaurantData.pais}</p>
      <p><strong>Teléfono:</strong> {restaurantData.telefono}</p>
      <p><strong>Email:</strong> {restaurantData.emailContacto}</p>
      <p><strong>Calificación:</strong> ⭐ {restaurantData.calificacion.toFixed(1) || "N/A"}</p>

      <h3>Horarios</h3>
      <ul>
        {restaurantData.horarios.map((horario, index) => (
          <li key={index}>{horario.dia}: {horario.horaApertura} - {horario.horaCierre}</li>
        ))}
      </ul>

      <h3>Capacidad de Mesas</h3>
      <ul>
        {restaurantData.capacidadMesas.map((mesa, index) => (
          <li key={index}>{mesa.cantidad} mesas de {mesa.personasPorMesa} personas</li>
        ))}
      </ul>


     {/* 📌 Carrusel de Galería de Fotos */}
     {restaurantData.galeriaFotos && restaurantData.galeriaFotos.length > 0 ? (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
          <h3>Galería de Fotos</h3>
          <Slider {...sliderSettings}>
            {restaurantData.galeriaFotos.map((foto, index) => (
              <div key={index}>
                <Image 
                  src={foto} 
                  alt={`Foto ${index + 1}`} 
                  width={600} 
                  height={400} 
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p style={{ color: "gray" }}>No hay fotos en la galería.</p>
      )}


<button
        onClick={() => router.push(`/dashboard/restaurants/${restaurant}/reservations`)}
        style={{ margin: "10px", padding: "10px", backgroundColor: "blue", color: "white" }}
      >
        Ver Reservas
      </button>

      <button
        onClick={() => router.push(`/dashboard/restaurants/${restaurant}/reviews`)}
        style={{ margin: "10px", padding: "10px", backgroundColor: "green", color: "white" }}
      >
        Ver Reseñas
      </button>




      <button
        onClick={() => router.push(`/dashboard/restaurants/${restaurant}/edit`)}
        style={{ padding: "10px 15px", backgroundColor: "blue", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" }}
      >
        Editar Restaurante
      </button>
    </div>
  );
}
