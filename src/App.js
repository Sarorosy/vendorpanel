import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import './style.css';
import Signin from "./pages/Signin";


const App = () => {
  const isLoggedIn = localStorage.getItem("vendorToken");

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/signin" element={!isLoggedIn ? <Signin /> : <Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;
