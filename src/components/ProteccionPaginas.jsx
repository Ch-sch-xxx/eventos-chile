import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProteccionPaginas() {
  const location = useLocation();
  const userLogged = localStorage.getItem("user-logged"); // 'admin' | 'usuario'
  const isLogged = userLogged === "admin" || userLogged === "usuario";

  if (!isLogged) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
