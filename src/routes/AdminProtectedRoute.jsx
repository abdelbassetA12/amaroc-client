import { Navigate, Outlet } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/auth"
        replace
      />
    );
  }

  return <Outlet />;
}