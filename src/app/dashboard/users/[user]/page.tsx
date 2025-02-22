"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IUser } from "@delatte/shared/interfaces";
import { getUserDetailsService, updateUserService } from "../../../../services/admin.service";


export default function UserProfile() {
  const { user } = useParams();
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<IUser>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetailsService();
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

  const handleInputChange = (field: keyof IUser, value: string) => {
    setUpdatedUser({ ...updatedUser, [field]: value });
  };

  const handleUpdateUser = async () => {
    try {
      if (!userDetails?._id) return;
      const updatedData = await updateUserService( updatedUser);
      setUserDetails(updatedData);
      setEditMode(false);
    } catch (error) {
      setError("Error al actualizar usuario.");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Perfil del Usuario</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : userDetails ? (
        <div>
          {!editMode ? (
            <>
              <p><strong>Nombre:</strong> {userDetails.nombre} {userDetails.apellido}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <button onClick={() => setEditMode(true)}>Editar</button>
            </>
          ) : (
            <>
              <input type="text" defaultValue={userDetails.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} />
              <input type="text" defaultValue={userDetails.apellido} onChange={(e) => handleInputChange("apellido", e.target.value)} />
              <button onClick={handleUpdateUser}>Guardar Cambios</button>
              <button onClick={() => setEditMode(false)}>Cancelar</button>
            </>
          )}
        </div>
      ) : (
        <p>No se encontraron datos del usuario.</p>
      )}
    </div>
  );
}
