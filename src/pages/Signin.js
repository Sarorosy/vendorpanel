import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://your-api.com/vendor/signin", formData);
      localStorage.setItem("vendorToken", res.data.token);
      toast.success("Signin successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signin failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Vendor Signin</h2>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="false">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
              isFormValid && !loading ? "green-btn" : "green-btn-disabled cursor-not-allowed"
            }`}
          >
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="green-text hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
