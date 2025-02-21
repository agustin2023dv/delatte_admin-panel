"use client";

import Link from "next/link";

export default function Home() {


  return (
    <div style={{ padding: "20px" }}>
      <h2>Landing</h2>
      <Link href="/login">Login</Link>

    </div>
  );
}
