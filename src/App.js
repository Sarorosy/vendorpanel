import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders"; // Create an Orders page
import VendorLayout from "./layout/VendorLayout";
import './output.css';
import './style.css';
import Profile from "./pages/Profile";
import ProductsPage from "./pages/ProductsPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? children : <Navigate to="/signin" />;
};


const App = () => {
  return (
    <AuthProvider>
      <Router basename="vendor">
        <Toaster position="top-center" />
        <Routes>
          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Vendor Layout with Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
