"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

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
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/dashboard"); // 🔹 Redirige al dashboard
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (error) {
      setError("Error al iniciar sesión.");
      console.error("Error en login:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Login"}
        </button>
      </form>

      {/* 🔹 Botón de Login con Google */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Iniciar sesión con Google
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
