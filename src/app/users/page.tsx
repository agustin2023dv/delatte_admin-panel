"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IUser } from "@delatte/shared/interfaces";
import { getUsersService } from "../../../admin.service";

export default function UsersManagement() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersService();
        setUsers(data);
      } catch (error) {
        setError("Error al obtener la lista de usuarios.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Usuarios</h1>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id.toString()}>
              {user.nombre} {user.apellido} - {user.email}
              <Link href={`/users/${user._id}`} style={{ marginLeft: "10px", color: "blue" }}>
                Ver más
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
