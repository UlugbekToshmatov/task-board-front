import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function ProtectedRoute() {
  const { token } = useAppSelector((store) => store.auth);

  if (!token) {
    return <Navigate to="/login?message=Please, sign in to access this page" replace />;
  }

  return <Outlet />;
}
