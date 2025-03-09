"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { IReservation } from "@delatte/shared/interfaces";
import { getReservationByIdService, modifyReservationService, cancelReservationService } from "services/reservations/reservations.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReservationDetails() {
  const { id } = useParams(); 
  const [reservationData, setReservationData] = useState<IReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [numAdultos, setNumAdultos] = useState(1);
  const [numNinos, setNumNinos] = useState(0);

  const fetchReservation = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getReservationByIdService(id as string);
      setReservationData(data);
    } catch (error) {
      toast.error("Error al obtener la reserva.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [id, fetchReservation]);

  const handleCancelReservation = async () => {
    if (!confirm("¿Está seguro de que desea cancelar esta reserva?")) return;
    setLoadingAction(true);
    try {
      await cancelReservationService(id as string);
      toast.success("Reserva cancelada correctamente.");
      fetchReservation();
    } catch (error) {
      toast.error("Error al cancelar la reserva.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const openEditModal = () => {
    if (!reservationData) return;
    setNewDate(reservationData.fecha.toISOString().split("T")[0]);
    setNewTime(reservationData.horario);
    setNumAdultos(reservationData.numAdultos);
    setNumNinos(reservationData.numNinos);
    setShowModal(true);
  };

  const handleModifyReservation = async () => {
    if (!newDate || !newTime) {
      toast.warn("Debe ingresar una fecha y un horario válidos.");
      return;
    }
    setLoadingAction(true);
    try {
      await modifyReservationService(id as string, {
        fecha: new Date(newDate),
        horario: newTime,
        numAdultos,
        numNinos,
      });
      toast.success("Reserva modificada correctamente.");
      setShowModal(false);
      fetchReservation();
    } catch (error) {
      toast.error("Error al modificar la reserva.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) return <p>Cargando reserva...</p>;
  if (!reservationData) return <p>No se encontró la reserva.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Detalles de la Reserva</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Restaurante</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {typeof reservationData.restaurante === "object" && "nombre" in reservationData.restaurante
                ? reservationData.restaurante.nombre
                : "No disponible"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Cliente</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {typeof reservationData.usuario === "object" && "nombre" in reservationData.usuario
                ? `${reservationData.usuario.nombre} ${reservationData.usuario.apellido}`
                : "Cliente desconocido"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Fecha</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {new Date(reservationData.fecha).toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Horario</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{reservationData.horario}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Estado</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold", color: 
              reservationData.estado === "Confirmada" ? "green" :
              reservationData.estado === "Cancelada" ? "red" :
              "gray"
            }}>
              {reservationData.estado}
            </td>
          </tr>
        </tbody>
      </table>

      {reservationData.estado === "Confirmada" && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={openEditModal} style={{ padding: "10px 15px", backgroundColor: "orange", color: "white" }}>
            Modificar
          </button>
          <button onClick={handleCancelReservation} style={{ padding: "10px 15px", backgroundColor: "red", color: "white" }}>
            Cancelar
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <h3>Modificar Reserva</h3>
          <label>Fecha:</label>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          
          <label>Hora:</label>
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />

          <label>Adultos:</label>
          <input type="number" min="1" value={numAdultos} onChange={(e) => setNumAdultos(Number(e.target.value))} />

          <label>Niños:</label>
          <input type="number" min="0" value={numNinos} onChange={(e) => setNumNinos(Number(e.target.value))} />

          <button onClick={handleModifyReservation} disabled={loadingAction}>
            {loadingAction ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
