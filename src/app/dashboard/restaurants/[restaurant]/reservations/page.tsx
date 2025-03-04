"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReservationsByRestaurantService } from "services/reservations.service";
import { IReservation } from "@delatte/shared/interfaces";

export default function RestaurantReservations() {
  const { restaurant } = useParams();
  const router = useRouter();
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!restaurant) return;
      try {
        const data: IReservation[] = await getReservationsByRestaurantService(restaurant as string);

        // 🔹 Ordenar cronológicamente si `fecha` existe
        const sortedData = data
          .filter((reserva: IReservation) => reserva.fecha) // Filtrar reservas sin fecha
          .sort((a: IReservation, b: IReservation) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setReservations(sortedData);
      } catch (error) {
        setError("Error al obtener las reservas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [restaurant]);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (reservations.length === 0) return <p>No hay reservas registradas.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reservas del Restaurante</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid black", padding: "8px" }}>Fecha</th>
            <th style={{ borderBottom: "2px solid black", padding: "8px" }}>Cliente</th>
            <th style={{ borderBottom: "2px solid black", padding: "8px" }}>Estado</th> 
            <th style={{ borderBottom: "2px solid black", padding: "8px" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reserva: IReservation) => {
            const fechaReserva = reserva.fecha ? new Date(reserva.fecha).toLocaleDateString() : "Sin fecha";

            // 🔹 Verificar si `usuario` es un objeto o un ObjectId antes de acceder a sus propiedades
            const cliente =
              typeof reserva.usuario === "object" && "nombre" in reserva.usuario
                ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
                : "Cliente desconocido";

            // 🔹 Definir color para el estado
            const estadoColor =
              reserva.estado === "Confirmada"
                ? "green"
                : reserva.estado === "Cancelada"
                ? "red"
                : "gray";

            return (
              <tr key={reserva._id.toString()}>
                <td style={{ padding: "8px" }}>{fechaReserva}</td>
                <td style={{ padding: "8px" }}>{cliente}</td>
                <td style={{ padding: "8px", fontWeight: "bold", color: estadoColor }}>
                  {reserva.estado}
                </td> 
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => router.push(`/dashboard/restaurants/${restaurant}/reservations/${reserva._id}`)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "blue",
                      color: "white",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
