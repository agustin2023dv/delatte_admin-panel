"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IUser } from "@delatte/shared/interfaces";
import { getUserDetailsService } from "../../../../services/admin.service";
import Image from "next/image";

export default function UserProfile() {
  const { user } = useParams();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetailsService(user as string);
        setUserDetails(data);
      } catch (error) {
        setError("Error al obtener el perfil del usuario.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Perfil del Usuario</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : userDetails ? (
        <div>
          {/* Imagen de perfil */}
          <div style={{ marginBottom: "15px" }}>
  <label><strong>Foto de Perfil:</strong></label>
  <Image
    src={userDetails.profileImage && userDetails.profileImage.startsWith("http") 
      ? userDetails.profileImage 
      : "/default-restaurant.jpg"} 
    alt="Imagen de perfil"
    width={100}
    height={100}
    style={{ borderRadius: "50%", marginLeft: "10px" }}
    priority
  />
</div>

          {/* Nombre y Apellido */}
          <p>
            <strong>Nombre:</strong> {userDetails.nombre} {userDetails.apellido}
          </p>

          {/* Email */}
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>

          {/* Teléfono */}
          <p>
            <strong>Teléfono:</strong> {userDetails.phone || "No disponible"}
          </p>

          {/* Rol */}
          <p>
            <strong>Rol:</strong> {userDetails.role === "customer"
              ? "Cliente"
              : userDetails.role === "manager"
              ? "Manager"
              : "Superadmin"}
          </p>

          {/* Botones */}
          <button
            onClick={() => router.push(`/dashboard/users/${user}/reservations`)}
            style={{ margin: "10px", padding: "10px", backgroundColor: "blue", color: "white" }}
          >
            Ver Reservas
          </button>

          <button
            onClick={() => router.push(`/dashboard/users/${user}/reviews`)}
            style={{ margin: "10px", padding: "10px", backgroundColor: "green", color: "white" }}
          >
            Ver Reseñas
          </button>

          <button
            onClick={() => router.push(`/dashboard/users/${user}/edit`)}
            style={{
              padding: "10px 15px",
              backgroundColor: "blue",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Editar Usuario
          </button>
        </div>
      ) : (
        <p>No se encontró el usuario.</p>
      )}
    </div>
  );
}
