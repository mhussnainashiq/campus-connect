
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    currentUser,
    loading,
    isAdmin,
  } = useAuth();

  /* Wait until AuthContext finishes loading */
  if (loading) {
    return (
      <div className="page-loading">
        <p>Loading Campus Connect...</p>
      </div>
    );
  }

  /* User is not logged in */
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* Logged in but not an administrator */
  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* Administrator */
  return <Outlet />;
}

export default AdminRoute;