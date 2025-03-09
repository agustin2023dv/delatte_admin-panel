"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReservationByIdService, modifyReservationService, cancelReservationService } from "services/reservations/reservations.service";
import { IReservation } from "@delatte/shared/interfaces";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReservationDetails() {
  const { id } = useParams();
  const [reservation, setReservation] = useState<IReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [numAdultos, setNumAdultos] = useState(1);
  const [numNinos, setNumNinos] = useState(0);
  const [pedidosEspeciales, setPedidosEspeciales] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await getReservationByIdService(id as string);
        setReservation(data);
      } catch (error) {
        toast.error("Error al obtener la reserva.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id]);

  if (loading) return <p>Cargando reserva...</p>;
  if (!reservation) return <p>No se encontró la reserva.</p>;

  const usuario = reservation.usuario && typeof reservation.usuario === "object" && "nombre" in reservation.usuario
    ? reservation.usuario
    : null;

  const restaurante = reservation.restaurante && typeof reservation.restaurante === "object" && "nombre" in reservation.restaurante
    ? reservation.restaurante
    : null;

  // 📌 Cancelar reserva
  const handleCancelReservation = async () => {
    if (!confirm("¿Está seguro de que desea cancelar esta reserva?")) return;
    setLoadingAction(true);
    try {
      await cancelReservationService(id as string);
      toast.success("Reserva cancelada correctamente.");
      
      // ✅ Crear una copia limpia antes de actualizar el estado
      setReservation((prev) => prev ? JSON.parse(JSON.stringify({ ...prev, estado: "Cancelada" })) : null);
      
    } catch (error) {
      toast.error("Error al cancelar la reserva.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  // 📌 Abrir modal para editar
  const openEditModal = () => {
    if (!reservation) return;
    setNewDate(reservation.fecha.toISOString().split("T")[0]);
    setNewTime(reservation.horario);
    setNumAdultos(reservation.numAdultos);
    setNumNinos(reservation.numNinos);
    setPedidosEspeciales(reservation.pedidosEspeciales || "");
    setShowModal(true);
  };

  // 📌 Modificar reserva
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
        pedidosEspeciales,
      });
      toast.success("Reserva modificada correctamente.");
      setShowModal(false);


      setReservation((prev) => prev ? JSON.parse(JSON.stringify({
        ...prev,
        fecha: new Date(newDate),
        horario: newTime,
        numAdultos,
        numNinos,
        pedidosEspeciales,
      })) : null);

    } catch (error) {
      toast.error("Error al modificar la reserva.");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Detalles de la Reserva</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Restaurante</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {restaurante ? `${restaurante.nombre} - ${restaurante.direccion}` : "No disponible"}
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Cliente</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {usuario ? `${usuario.nombre} ${usuario.apellido}` : "Cliente desconocido"}
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Fecha</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {new Date(reservation.fecha).toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Horario</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{reservation.horario}</td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>Estado</td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: "bold", color: reservation.estado === "Confirmada" ? "green" : reservation.estado === "Cancelada" ? "red" : "gray" }}>
              {reservation.estado}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 📌 Botones de Modificar y Cancelar */}
      {reservation.estado !== "Pasada" && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={openEditModal} style={{ padding: "10px 15px", backgroundColor: "orange", color: "white" }}>
            Modificar
          </button>
          <button onClick={handleCancelReservation} style={{ padding: "10px 15px", backgroundColor: "red", color: "white" }}>
            Cancelar
          </button>
        </div>
      )}

      {/* 📌 Modal para editar */}
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
