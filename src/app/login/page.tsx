"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react"; 
import { loginAdminService } from "services/admin/adminUsers.service";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 🔹 Intentar iniciar sesión con credenciales
      const { token, user } = await loginAdminService(email, password);

      if (token && user) {
        console.log("✅ Login exitoso con credenciales:", user);
        router.push("/dashboard"); // Redirigir al dashboard
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (error) {
      setError("Error al iniciar sesión.");
      console.error("❌ Error en login con credenciales:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>
      
      {/* 🔹 Formulario para login con email y password */}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      {/* 🔹 Botón para login con Google */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          padding: "10px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Iniciar sesión con Google
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
