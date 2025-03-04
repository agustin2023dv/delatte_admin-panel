"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllReservationsService, createReservationService } from "services/reservations.service";
import { getAllRestaurantsService } from "services/restaurants.service"; 
import { IReservation, IRestaurant } from "@delatte/shared/interfaces";
import { toast } from "react-toastify";
import { getUsersService } from "services/admin.service";

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Partial<IReservation>[]>([]);
  const [users, setUsers] = useState<{ _id: string; nombre: string; apellido: string }[]>([]);
  const [restaurants, setRestaurants] = useState<Partial<IRestaurant>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    clienteId: "",
    restauranteId: "",
    fecha: "",
    horario: "",
    numAdultos: 1,
    numNinos: 0,
    pedidosEspeciales: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservasData, usuariosData, restaurantesData] = await Promise.all([
          getAllReservationsService(),
          getUsersService(),
          getAllRestaurantsService(),
        ]);

        setReservations(reservasData);
        setUsers(usuariosData);
        setRestaurants(restaurantesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateReservation = async () => {
    if (!newReservation.clienteId || !newReservation.restauranteId || !newReservation.fecha || !newReservation.horario || newReservation.numAdultos < 1) {
      toast.warn("Todos los campos son obligatorios.");
      return;
    }

    try {
      const nuevaReserva = await createReservationService({
        ...newReservation,
        fecha: newReservation.fecha ? new Date(newReservation.fecha) : new Date(),
      });

      toast.success("Reserva creada con éxito.");
      setShowModal(false);

      // Agregar nueva reserva sin recargar todo
      setReservations((prev) => [...prev, nuevaReserva]);
    } catch (error) {
      toast.error("Error al crear la reserva.");
      console.error(error);
    }
  };

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (reservations.length === 0) return <p>No hay reservas registradas.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Reservas</h1>

      {/* 📌 Botón para abrir el modal */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "10px 15px",
          backgroundColor: "green",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Crear Reserva
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Restaurante</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reserva: Partial<IReservation>) => {
            const fechaReserva = reserva.fecha ? new Date(reserva.fecha).toLocaleDateString() : "Sin fecha";
            const cliente = reserva.usuario && typeof reserva.usuario === "object" && "nombre" in reserva.usuario
              ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
              : "Cliente desconocido";

            const restaurante = reserva.restaurante && typeof reserva.restaurante === "object" && "nombre" in reserva.restaurante
              ? reserva.restaurante.nombre
              : "Desconocido";

            const estadoColor =
              reserva.estado === "Confirmada"
                ? "green"
                : reserva.estado === "Cancelada"
                ? "red"
                : "gray";

            return (
              <tr key={reserva._id?.toString()}>
                <td>{fechaReserva}</td>
                <td>{reserva.horario}</td>
                <td>{restaurante}</td>
                <td>{cliente}</td>
                <td style={{ fontWeight: "bold", color: estadoColor }}>{reserva.estado}</td>
                <td>
                  <button onClick={() => router.push(`/dashboard/reservations/${reserva._id}`)}>Ver Detalles</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 📌 Modal para crear una reserva */}
      {showModal && (
        <div className="modal">
          <h3>Crear Reserva</h3>

          <label>Usuario:</label>
          <select value={newReservation.clienteId} onChange={(e) => setNewReservation({ ...newReservation, clienteId: e.target.value })}>
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.nombre} {user.apellido}
              </option>
            ))}
          </select>

          <label>Restaurante:</label>
          <select value={newReservation.restauranteId} onChange={(e) => setNewReservation({ ...newReservation, restauranteId: e.target.value })}>
            <option value="">Seleccione un restaurante</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id?.toString()} value={restaurant._id?.toString()}>
                {restaurant.nombre}
              </option>
            ))}
          </select>

          <label>Fecha:</label>
          <input type="date" value={newReservation.fecha} onChange={(e) => setNewReservation({ ...newReservation, fecha: e.target.value })} />

          <label>Hora:</label>
          <input type="time" value={newReservation.horario} onChange={(e) => setNewReservation({ ...newReservation, horario: e.target.value })} />

          <label>Adultos:</label>
          <input type="number" min="1" value={newReservation.numAdultos} onChange={(e) => setNewReservation({ ...newReservation, numAdultos: Number(e.target.value) })} />

          <button onClick={handleCreateReservation}>Guardar Reserva</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
