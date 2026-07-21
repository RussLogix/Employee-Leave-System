import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="Employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="Manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;