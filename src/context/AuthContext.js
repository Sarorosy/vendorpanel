import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("vendorUser"));
    if (storedUser) {
      console.log("storeduser", storedUser);
      setUser(storedUser);
    }
    setLoading(false); // Set loading to false after fetching user
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("vendorUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vendorUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
