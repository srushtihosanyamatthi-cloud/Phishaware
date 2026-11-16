import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phishaware-user") || "null");
    } catch {
      return null;
    }
  });

  async function authenticate(path, credentials) {
    const data = await api(path, { method: "POST", body: JSON.stringify(credentials) });
    localStorage.setItem("phishaware-token", data.token);
    localStorage.setItem("phishaware-user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("phishaware-token");
    localStorage.removeItem("phishaware-user");
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    login: (credentials) => authenticate("/users/login", credentials),
    register: (credentials) => authenticate("/users/register", credentials),
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
