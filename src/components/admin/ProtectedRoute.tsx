import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  // Ambil status dari "otak" login
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Jika masih loading, tunggu...
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 2. Jika sudah tidak loading, cek status
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
