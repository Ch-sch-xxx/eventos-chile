import { Navigate, Outlet, useLocation } from "react-router-dom";

function isAuthenticated() {
  const role = localStorage.getItem("user-logged");
  const email = localStorage.getItem("user-email");
  return (role === "admin" || role === "usuario") && !!email;
}

export default function ProteccionPaginas() {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
