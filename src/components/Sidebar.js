import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Package, ChevronLeft, ChevronRight, LogOut, Store, BadgeCheck } from "lucide-react";
import cannabislogo from "../assets/weedlogo.svg";
import { useAuth } from "../context/AuthContext";


const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setError(null);
          sendLocation(newLocation);
        },
        (err) => {
          setError("Location access denied. Click to retry.");
          setLocation(null);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const sendLocation = async (loc) => {
    if (!user?.token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      const response = await fetch("https://ryupunch.com/leafly/api/Vendor/update_location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          latitude: loc.lat,
          longitude: loc.lng,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Location updated successfully:", data);
      } else {
        console.error("Failed to update location:", data.message);
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div
      className="text-xs p-2 text-center bg-green-800 rounded-md cursor-pointer hover:bg-green-700"
      onClick={getLocation}
    >
      {location ? `📍 ${location.lat}, ${location.lng}` : error || "Fetching location..."}
    </div>
  );
};

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div
      className={`h-screen bg-[#1E3A1E] text-white shadow-2xl transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      } flex flex-col relative`}
    >
      {/* Sidebar Header */}
      <div className={`${isExpanded ? "justify-between" : "justify-center"} flex items-center p-3`}>
        {isExpanded && (
          <img
            src={cannabislogo}
            alt="LeafLux Logo"
            className="w-10 h-10 opacity-90 transition-all duration-300 hover:scale-110"
          />
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 bg-green-700 hover:bg-green-600 rounded-full transition-transform hover:scale-110"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2 flex-1 overflow-x-hidden">
        <li>
          <Link
            to="/dashboard"
            className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-green-900 transition-all duration-200 hover:pl-5`}
          >
            <Home size={18} /> {isExpanded && "Dashboard"}
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-green-900 transition-all duration-200 hover:pl-5`}
          >
            <Store size={18} /> {isExpanded && "Manage Store"}
          </Link>
        </li>
      </ul>

      {/* User Profile */}
      <Link to="/profile">
        <div className={`${isExpanded ? "flex" : ""} flex justify-center items-center mb-4`}>
          <img
            src={user.profile ? "https://ryupunch.com/leafly/uploads/vendors/" +user.profile : "https://i.pravatar.cc/40"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-white shadow-lg"
          />
          {isExpanded && <p className="flex items-center ml-2 text-xs font-medium tracking-wide opacity-80">{user.company_name} <BadgeCheck size={19} className=" text-green-300 ml-1 " /></p>}
        </div>
      </Link>
      

      {/* Location Display */}
      {isExpanded && <LocationComponent />}

      {/* Logout Button */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm w-full p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all hover:pl-5"
        >
          <LogOut size={18} /> {isExpanded && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
