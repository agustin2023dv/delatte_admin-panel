"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IRestaurant } from "@delatte/shared/interfaces";
import { getAllRestaurantsService } from "services/restaurants.service";

export default function RestaurantsManagement() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRestaurantsService().then(setRestaurants).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Restaurantes</h1>
      {loading ? <p>Cargando restaurantes...</p> : (
        <ul>
          {restaurants.map((restaurant) => (
          <li key={restaurant._id.toString()}>
          {restaurant.nombre} - {restaurant.direccion}
          <Link href={`/restaurants/${restaurant._id.toString()}`}>Ver más</Link>
        </li>
          ))}
        </ul>
      )}
    </div>
  );
}
