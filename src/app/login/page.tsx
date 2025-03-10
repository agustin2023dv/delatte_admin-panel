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
      const { token, user } = await loginAdminService(email, password);

      if (token && user) {
        console.log("✅ Login exitoso con credenciales:", user);
        router.push("/dashboard");
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
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required style={styles.input} />
        <input type="password" name="password" placeholder="Contraseña" required style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>

      <hr style={styles.hr} />

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={styles.googleButton}
      >

        <img
          src="/google-icon.png"
          alt="Google Logo"
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
        Iniciar sesión con Google
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e7ded9", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  form: {
    width: "35%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#fff", 
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    color: "#271207", 
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: "40px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "0 10px",
  },
  button: {
    backgroundColor: "#a5744b",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
    marginTop: "10px",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffff",
    color: "#a5744b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "35%",
    padding: "12px",
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  hr: {
    margin: "20px 0",
    width: "35%",
  },
};
