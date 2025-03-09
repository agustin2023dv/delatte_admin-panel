"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IRestaurant } from "@delatte/shared/interfaces";
import { getRestaurantByIdService, updateRestaurantService } from "services/restaurants/restaurants.service";
import { handleUpload } from "components/UploadImage"; 

import Image from "next/image";
import { uploadRestaurantProfile } from "components/UploadRestaurantLogo";

export default function EditRestaurant() {
  const { restaurant } = useParams();
  const router = useRouter();
  const [restaurantData, setRestaurantData] = useState<Partial<IRestaurant> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurant) return;
      try {
        const data = await getRestaurantByIdService(restaurant as string);
        setRestaurantData(data);
      } catch (error) {
        setError("Error al obtener la información del restaurante.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurant]);

  const handleSave = async () => {
    if (!restaurantData) return;
    setSaving(true);
    try {
      await updateRestaurantService(restaurant as string, restaurantData);
      alert("Restaurante actualizado correctamente");
      router.push(`/dashboard/restaurants/${restaurant}`);
    } catch (error) {
      setError("No se pudo actualizar el restaurante.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Subir imágenes a la GALERÍA usando Cloudinary y actualizar en BD
  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await handleUpload(file);
    if (uploadedUrl) {
      const updatedGallery = [...(restaurantData!.galeriaFotos || []), uploadedUrl];

      // Guardar en la BD
      await updateRestaurantService(restaurant as string, { galeriaFotos: updatedGallery });

      // Actualizar estado local
      setRestaurantData((prevData) => ({
        ...prevData!,
        galeriaFotos: updatedGallery,
      }));
    }
  };

  // ✅ Subir el LOGO usando Cloudinary y actualizar en BD
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadRestaurantProfile(file); 
    if (uploadedUrl) {
      // Guardar en la BD
      await updateRestaurantService(restaurant as string, { logo: uploadedUrl });

      // Actualizar estado local
      setRestaurantData((prevData) => ({
        ...prevData!,
        logo: uploadedUrl,
      }));
    }
  };

  // ❌ Eliminar una imagen de la galería y actualizar BD
  const handleDeleteImage = async (index: number) => {
    if (!restaurantData) return;

    const updatedGallery = restaurantData.galeriaFotos?.filter((_, i) => i !== index) || [];

    // Guardar en la BD
    await updateRestaurantService(restaurant as string, { galeriaFotos: updatedGallery });

    // Actualizar estado local
    setRestaurantData({ ...restaurantData, galeriaFotos: updatedGallery });
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!restaurantData) return <p>No se encontró el restaurante.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Restaurante</h1>

      {/* Nombre del Restaurante */}
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={restaurantData.nombre || ""}
          onChange={(e) => setRestaurantData({ ...restaurantData, nombre: e.target.value })}
          style={{ display: "block", marginBottom: "10px" }}
        />
      </div>

      {/* Dirección */}
      <div>
        <label>Dirección:</label>
        <input
          type="text"
          value={restaurantData.direccion || ""}
          onChange={(e) => setRestaurantData({ ...restaurantData, direccion: e.target.value })}
          style={{ display: "block", marginBottom: "10px" }}
        />
      </div>

      {/* LOGO del Restaurante */}
      <div>
        <label>Logo del Restaurante:</label>
        <input type="file" onChange={handleLogoUpload} accept="image/*" />
        {restaurantData.logo && restaurantData.logo.startsWith("http") ? (
  <Image
    src={restaurantData.logo}
    alt="Logo del Restaurante"
    width={150}
    height={150}
    style={{ display: "block", marginTop: "10px", borderRadius: "8px" }}
  />
) : (
  <p style={{ color: "gray" }}>No hay logo disponible</p>
)}

      </div>

      {/* Galería de Fotos */}
      <div>
        <label>Galería de Fotos:</label>
        <input type="file" onChange={handleGalleryUpload} accept="image/*" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          {restaurantData.galeriaFotos?.map((foto, index) => (
            <div key={index} style={{ position: "relative" }}>
              <Image
                src={foto}
                alt={`Foto ${index + 1}`}
                width={100}
                height={100}
                style={{ borderRadius: "8px" }}
                priority
              />
              <button
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de guardar */}
      <button onClick={handleSave} disabled={saving} style={{ marginTop: "20px" }}>
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
