"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IReview } from "@delatte/shared/interfaces";
import { getReviewsByRestaurantService, deleteReviewService } from "services/reviews.service";

export default function RestaurantReviews() {
  const { restaurant } = useParams();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurant) return;

    const fetchReviews = async () => {
      try {
        const data = await getReviewsByRestaurantService(restaurant as string);
        setReviews(data);
      } catch (error) {
        setError("Error al obtener las reseñas del restaurante.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurant]);

  // 🔹 Función para eliminar una reseña
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reseña?")) return;

    try {
      await deleteReviewService(reviewId);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id.toString() !== reviewId));
    } catch (error) {
      alert("Error al eliminar la reseña.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reseñas del Restaurante</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : reviews.length > 0 ? (
        <div>
          {reviews.map((review) => {
            // 🔹 Verificación de datos poblados
            const usuario =
              typeof review.usuario === "object" && "nombre" in review.usuario
                ? review.usuario as { _id: string; nombre: string; apellido: string; email: string }
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
                <p><strong>Usuario:</strong> {usuario ? `${usuario.nombre} ${usuario.apellido}` : "No disponible"}</p>
                <p><strong>Email:</strong> {usuario ? usuario.email : "No disponible"}</p>
                <p><strong>Calificación:</strong> ⭐ {review.calificacion}/5</p>
                <p><strong>Comentario:</strong> {review.comentario}</p>
                <p style={{ fontSize: "12px", color: "gray" }}>
                  Fecha: {new Date(review.fecha).toLocaleDateString("es-ES")}
                </p>

                {/* 🔹 Botón para eliminar la reseña */}
                <button
                  onClick={() => handleDeleteReview(review._id.toString())}
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
                  Eliminar Reseña
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No hay reseñas para este restaurante.</p>
      )}
    </div>
  );
}
