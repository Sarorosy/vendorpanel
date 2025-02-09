import { createContext, useContext, useState, useEffect } from "react";
import { set, get, del } from "idb-keyval"; // Import IndexedDB helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await get("vendorUser");
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await set("vendorUser", userData);
  };

  const logout = async () => {
    setUser(null);
    await del("vendorUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
