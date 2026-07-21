import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("leaveSystemUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("leaveSystemToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const currentUser = response.data.user;

        setUser(currentUser);

        localStorage.setItem(
          "leaveSystemUser",
          JSON.stringify(currentUser),
        );
      } catch {
        localStorage.removeItem("leaveSystemToken");
        localStorage.removeItem("leaveSystemUser");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("leaveSystemToken", token);
    localStorage.setItem(
      "leaveSystemUser",
      JSON.stringify(loggedInUser),
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("leaveSystemToken");
    localStorage.removeItem("leaveSystemUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}