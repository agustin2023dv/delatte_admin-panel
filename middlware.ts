import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // Solo permite acceso si hay un token
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Protege todas las rutas bajo /dashboard
};
