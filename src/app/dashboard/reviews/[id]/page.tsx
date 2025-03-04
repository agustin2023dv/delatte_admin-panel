import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IReview } from "@delatte/shared/interfaces";
import { deleteReviewByIdService, getReviewByIdService } from "services/reviews.service";

const ReviewDetailsPage = () => {
  const [review, setReview] = useState<IReview | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      try {
        const reviewData: IReview = await getReviewByIdService(id as string);
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching review details:", error);
      }
    };

    fetchReview();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta reseña?");
    if (!confirmDelete) return; 

    try {
      await deleteReviewByIdService(id as string);
      alert("Reseña eliminada exitosamente");
      router.push("/dashboard/reviews");
    } catch (error) {
      alert("Error al eliminar la reseña");
      console.log(error);
    }
  };

  if (!review) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles de la Reseña</h1>
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold">
          Restaurante: {review.restaurante && typeof review.restaurante !== "string" && "_id" in review.restaurante ? review.restaurante.nombre : "Desconocido"}
        </h2>
        <p className="text-gray-700">{review.comentario}</p>
        <p className="text-sm text-gray-500">Calificación: {review.calificacion} ⭐</p>
        <p className="text-sm text-gray-500">Fecha: {new Date(review.fecha).toLocaleString()}</p>
        <p className="text-sm text-gray-500">
          Usuario: {review.usuario && typeof review.usuario !== "string" && "_id" in review.usuario ? `${review.usuario.nombre} ${review.usuario.apellido}` : "Desconocido"}
        </p>

        <div className="mt-4 flex gap-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Responder</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>Eliminar</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Enviar mensaje</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsPage;
