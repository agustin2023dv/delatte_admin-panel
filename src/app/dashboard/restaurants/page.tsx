"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IRestaurant } from "@delatte/shared/interfaces";
import { getAllRestaurantsService } from "services/restaurants.service";

export default function RestaurantsManagement() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurantsService();
        setRestaurants(data);
      } catch (error) {
        setError("Error al obtener la lista de restaurantes.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Restaurantes</h1>

      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {restaurants.map((restaurant) => (
            <div key={restaurant._id.toString()} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
           <Image 
  src={restaurant.logo.startsWith("http") ? restaurant.logo : "/default-restaurant.jpg"} 
  alt={restaurant.nombre} 
  width={300} 
  height={200}
  style={{ objectFit: "cover", borderRadius: "8px" }}
/>

              <h3>{restaurant.nombre}</h3>
              <p>{restaurant.localidad}, {restaurant.pais}</p>
              <p>⭐ {restaurant.calificacion.toFixed(1) || "N/A"}</p>
              <Link href={`/dashboard/restaurants/${restaurant._id}`} style={{ color: "blue", textDecoration: "underline" }}>
                Ver más
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
