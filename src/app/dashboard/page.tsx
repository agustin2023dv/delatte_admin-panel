import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <nav style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link href="/dashboard/users" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              👥 Gestión de Usuarios
            </Link>
          </li>
          <li style={{ marginTop: "10px" }}>
            <Link href="/dashboard/restaurants" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              🍽️ Gestión de Restaurantes
            </Link>
          </li>
          <li style={{ marginTop: "10px" }}>
            <Link href="/dashboard/reservations" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              📅 Gestión de Reservas
            </Link>
          </li>
          <li style={{ marginTop: "10px" }}>
            <Link href="/dashboard/reviews" style={{ textDecoration: "none", fontSize: "18px", color: "blue" }}>
              📝 Gestión de Reseñas
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
