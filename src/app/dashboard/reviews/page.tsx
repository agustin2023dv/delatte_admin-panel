"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllReviewsService } from "services/reviews.service";
import { IReview } from "@delatte/shared/interfaces";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData: IReview[] = await getAllReviewsService();
        const sortedReviews = reviewsData.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        setReviews(sortedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todas las Reviews</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id.toString()} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">
              {review.restaurante && typeof review.restaurante !== "string" && "_id" in review.restaurante
                ? review.restaurante.nombre
                : "Restaurante desconocido"}
            </h2>
            <p className="text-gray-700">{review.comentario}</p>
            <p className="text-sm text-gray-500">{new Date(review.fecha).toLocaleString()}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => router.push(`/dashboard/reviews/${review._id}`)}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
