import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "../lib/api";

export default function UserRoute() {
  const session = getSession();

  if (session?.accessToken && session.user?.role === "Admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
