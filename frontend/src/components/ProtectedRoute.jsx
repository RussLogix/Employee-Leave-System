import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-message">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const correctDashboard =
      user.role === "Manager" ? "/manager" : "/employee";

    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}

export default ProtectedRoute;