import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <nav style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link href="/users" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              👥 Gestión de Usuarios
            </Link>
          </li>
          <li style={{ marginTop: "10px" }}>
            <Link href="/restaurants" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              🍽️ Gestión de Restaurantes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
