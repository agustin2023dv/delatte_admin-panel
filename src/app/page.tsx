"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Bienvenido a</h2>
        <img src="/logo.png" alt="logo" style={styles.logo} />
      </div>

      <h2 style={styles.subtitle}>
        Panel de administrador
      </h2>

      <Link href="/login" style={styles.button}>
        <span style={styles.buttonText}>Iniciar sesión</span>
      </Link>
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
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#271207",
    marginRight: "10px",
  },
  logo: {
    width: "220px",
    height: "100px",
    objectFit: "contain",
  },
  subtitle: {
    fontSize: "16px",
    color: "#271207",
    marginBottom: "20px",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#a5744b",
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "15px",
    width: "35%",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  buttonText: {
    color: "#fff",
    fontSize: "16px",
    textAlign: "center",
  },
};
