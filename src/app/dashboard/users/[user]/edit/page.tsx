"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IUser } from "@delatte/shared/interfaces";
import Image from "next/image";
import { getUserDetailsService, updateUserService } from "services/admin.service";
import { uploadUserProfile } from "components/UploadUserPhoto";

export default function EditUser() {
  const { user } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState<Partial<IUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const data = await getUserDetailsService(user as string);
        setUserData(data);
      } catch (error) {
        setError("Error al obtener los datos del usuario.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      await updateUserService(user as string, userData);
      alert("Usuario actualizado correctamente");
      router.push(`/dashboard/users/${user}`);
    } catch (error) {
      setError("No se pudo actualizar el usuario.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Subir imagen de perfil a Cloudinary y actualizar en BD
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadUserProfile(file);
    if (uploadedUrl) {
      setUserData((prevData) => ({
        ...prevData!,
        profileImage: uploadedUrl,
      }));
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData) return <p>No se encontró el usuario.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Usuario</h1>

      {/* Imagen de Perfil */}
      <div>
        <label>Foto de Perfil:</label>
        <input type="file" onChange={handleProfileImageUpload} accept="image/*" />
        {userData.profileImage ? (
   <Image
   src={userData.profileImage && userData.profileImage.startsWith("http") 
     ? userData.profileImage 
     : "/default-restaurant.jpg"} 
   alt="Imagen de perfil"
   width={100}
   height={100}
   style={{ borderRadius: "50%", marginTop: "10px" }}
   priority
 />
        ) : (
          <p style={{ color: "gray" }}>No hay imagen de perfil</p>
        )}
      </div>

      {/* Campos Editables */}
      {Object.keys(userData).map((field) => {
        if (["_id", "password", "reviews", "favoriteRestaurants"].includes(field)) {
          return null; // No se debe editar el ID, la contraseña, reviews ni restaurantes favoritos aquí
        }

        if (field === "isVerified" || field === "isActive") {
          return (
            <label key={field} style={{ display: "block", marginTop: "10px" }}>
              {field === "isVerified" ? "Verificado" : "Activo"}:
              <input
                type="checkbox"
                checked={userData[field as keyof IUser] as boolean}
                onChange={(e) =>
                  setUserData({ ...userData, [field]: e.target.checked })
                }
                style={{ marginLeft: "10px" }}
              />
            </label>
          );
        }

        if (field === "role") {
          return (
            <div key={field}>
              <label>Rol:</label>
              <select
                value={userData.role}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value as IUser["role"] })
                }
                style={{ display: "block", marginBottom: "10px" }}
              >
                <option value="customer">Cliente</option>
                <option value="manager">Manager</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          );
        }

        if (field === "addresses") {
          return (
            <div key={field}>
              <label>Direcciones:</label>
              {userData.addresses?.map((address, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      const newAddresses = [...userData.addresses!];
                      newAddresses[index] = e.target.value;
                      setUserData({ ...userData, addresses: newAddresses });
                    }}
                  />
                  <button
                    onClick={() => {
                      const newAddresses = userData.addresses?.filter((_, i) => i !== index) || [];
                      setUserData({ ...userData, addresses: newAddresses });
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setUserData({
                    ...userData,
                    addresses: [...(userData.addresses || []), ""],
                  })
                }
              >
                Agregar Dirección
              </button>
            </div>
          );
        }

        return (
          <div key={field}>
            <label>{field}:</label>
            <input
              type={field === "dob" ? "date" : "text"}
              value={field === "dob" && userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : userData[field as keyof IUser] || ""}
              onChange={(e) =>
                setUserData({ ...userData, [field]: e.target.value })
              }
              style={{ display: "block", marginBottom: "10px" }}
            />
          </div>
        );
      })}

      {/* Botón de Guardar */}
      <button onClick={handleSave} disabled={saving} style={{ marginTop: "20px" }}>
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
