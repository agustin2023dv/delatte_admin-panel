"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IReview } from "@delatte/shared/interfaces";
import { getReviewsByUserService, deleteReviewService } from "services/reviews/reviews.service";

export default function UserReviews() {
  const { user } = useParams();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      try {
        const data = await getReviewsByUserService(user as string);
        setReviews(data);
      } catch (error) {
        setError("Error al obtener las reseñas del usuario.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  // 🔹 Función para eliminar una reseña
  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reseña?")) return;

    try {
      await deleteReviewService(reviewId);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id.toString() !== reviewId));
    } catch (error) {
      alert("Error al eliminar la reseña.");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reseñas del Usuario</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : reviews.length > 0 ? (
        <div>
          {reviews.map((review) => {
            const restaurante =
              typeof review.restaurante === "object" && "nombre" in review.restaurante
                ? review.restaurante
                : null;

            return (
              <div
                key={review._id.toString()}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p><strong>Restaurante:</strong> {restaurante ? restaurante.nombre : "No disponible"}</p>
                <p><strong>Dirección:</strong> {restaurante ? restaurante.direccion : "No disponible"}</p>
                <p><strong>Calificación:</strong> {review.calificacion} / 5 ⭐</p>
                <p><strong>Comentario:</strong> {review.comentario}</p>
                <p style={{ fontSize: "12px", color: "gray" }}>
                  Fecha: {new Date(review.fecha).toLocaleDateString("es-ES")}
                </p>
                {/* 🔹 Botón para eliminar la reseña */}
                <button
                  onClick={() => handleDelete(review._id.toString())}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>El usuario no ha dejado ninguna reseña.</p>
      )}
    </div>
  );
}
