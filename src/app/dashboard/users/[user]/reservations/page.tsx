"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { IReservation } from "@delatte/shared/interfaces";
import {
  getUserReservationsService,
  cancelReservationService,
  modifyReservationService,
} from "services/reservations.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserReservations() {
  const { user } = useParams();
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [numAdultos, setNumAdultos] = useState(1);
const [numNinos, setNumNinos] = useState(0);
const [pedidosEspeciales, setPedidosEspeciales] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserReservationsService(user as string);
      setReservations(data);
    } catch (error) {
      setError("Error al obtener las reservas del usuario.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchReservations();
  }, [user, fetchReservations]); 

  const currentDate = new Date();

  const futureReservations = reservations.filter((res) => new Date(res.fecha) >= currentDate);
  const pastReservations = reservations.filter((res) => new Date(res.fecha) < currentDate);

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("¿Está seguro de que desea cancelar esta reserva?")) return;

    setLoadingAction(reservationId);
    try {
      await cancelReservationService(reservationId);
      toast.success("Reserva cancelada correctamente.");
      fetchReservations();
    } catch (error) {
      toast.error("Error al cancelar la reserva.");
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const openEditModal = (reservation: IReservation) => {
    setSelectedReservation(reservation);
    setNewDate(reservation.fecha.toISOString().split("T")[0]);
    setNewTime(reservation.horario);
    setShowModal(true);
  };

  const handleModifyReservation = async () => {
    if (!newDate || !newTime) {
      toast.warn("Debe ingresar una fecha y un horario válidos.");
      return;
    }

    setLoadingAction(selectedReservation?._id.toString() || "");
    try {
      await modifyReservationService(selectedReservation?._id.toString() || "", {
        fecha: new Date(newDate),
        horario: newTime,
      });
      toast.success("Reserva modificada correctamente.");
      setShowModal(false);
      fetchReservations();
    } catch (error) {
      toast.error("Error al modificar la reserva.");
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reservas del Usuario</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <h3>Reservas Futuras</h3>
          {futureReservations.length > 0 ? (
            <ul>
              {futureReservations.map((reservation) => (
                <li key={reservation._id.toString()}>
                  <strong>Restaurante:</strong>{" "}
                  {typeof reservation.restaurante === "object" && "nombre" in reservation.restaurante
                    ? reservation.restaurante.nombre
                    : "No disponible"}{" "}
                  <br />
                  <strong>Fecha:</strong> {new Date(reservation.fecha).toLocaleDateString()} <br />
                  <strong>Hora:</strong> {reservation.horario} <br />
                  <strong>Personas:</strong> {reservation.numAdultos ?? 0} adultos,{" "}
                  {reservation.numNinos ?? 0} niños <br />

                  <button
                    onClick={() => openEditModal(reservation)}
                    disabled={loadingAction === reservation._id.toString()}
                    style={{
                      margin: "5px",
                      padding: "8px 12px",
                      backgroundColor: "orange",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      opacity: loadingAction === reservation._id.toString() ? 0.5 : 1,
                    }}
                  >
                    {loadingAction === reservation._id.toString() ? "Procesando..." : "Modificar"}
                  </button>

                  <button
                    onClick={() => handleCancelReservation(reservation._id.toString())}
                    disabled={loadingAction === reservation._id.toString()}
                    style={{
                      margin: "5px",
                      padding: "8px 12px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      opacity: loadingAction === reservation._id.toString() ? 0.5 : 1,
                    }}
                  >
                    {loadingAction === reservation._id.toString() ? "Cancelando..." : "Cancelar"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reservas futuras.</p>
          )}

          <h3>Reservas Pasadas</h3>
          {pastReservations.length > 0 ? (
            <ul>
              {pastReservations.map((reservation) => (
                <li key={reservation._id.toString()}>
                  <strong>Restaurante:</strong>{" "}
                  {typeof reservation.restaurante === "object" && "nombre" in reservation.restaurante
                    ? reservation.restaurante.nombre
                    : "No disponible"}{" "}
                  <br />
                  <strong>Fecha:</strong> {new Date(reservation.fecha).toLocaleDateString()} <br />
                  <strong>Hora:</strong> {reservation.horario} <br />
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reservas pasadas.</p>
          )}
        </>
      )}

{showModal && selectedReservation && (
  <div className="modal">
    <h3>Modificar Reserva</h3>
    
    {/* Fecha */}
    <label>Fecha:</label>
    <input
      type="date"
      value={newDate}
      onChange={(e) => setNewDate(e.target.value)}
      min={new Date().toISOString().split("T")[0]} // Restringe a fechas futuras
    />

    {/* Horario */}
    <label>Hora:</label>
    <input
      type="time"
      value={newTime}
      onChange={(e) => setNewTime(e.target.value)}
    />

    {/* Número de Adultos */}
    <label>Adultos:</label>
    <input
      type="number"
      min="1"
      value={numAdultos}
      onChange={(e) => setNumAdultos(Number(e.target.value))}
    />

    {/* Número de Niños */}
    <label>Niños:</label>
    <input
      type="number"
      min="0"
      value={numNinos}
      onChange={(e) => setNumNinos(Number(e.target.value))}
    />

    {/* Pedidos Especiales */}
    <label>Pedidos Especiales:</label>
    <textarea
      value={pedidosEspeciales}
      onChange={(e) => setPedidosEspeciales(e.target.value)}
      maxLength={500}
    />

    {/* Botones */}
    <button onClick={handleModifyReservation} disabled={loadingAction === selectedReservation._id.toString()}>
      {loadingAction === selectedReservation._id.toString() ? "Guardando..." : "Guardar Cambios"}
    </button>
    <button onClick={() => setShowModal(false)}>Cancelar</button>
  </div>
)}

    </div>
  );
}
