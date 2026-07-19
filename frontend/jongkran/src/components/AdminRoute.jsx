import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../lib/api";

export default function AdminRoute() {
  const location = useLocation();
  const session = getSession();

  if (!session?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (session.user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
