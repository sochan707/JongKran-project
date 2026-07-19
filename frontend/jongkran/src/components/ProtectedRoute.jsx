import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Please log in first to cook recipes and view ingredients or instructions.",
          returnTo: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return children;
}
