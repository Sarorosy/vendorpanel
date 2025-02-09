import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut, User } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-700">Vendor Dashboard</h1>

      {/* User Profile Section */}
      <div className="relative">
        <button 
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img 
            src="https://i.pravatar.cc/40" 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full"
          />
          <span>{user?.name}</span>
          <ChevronDown size={18} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <div className="px-4 py-2 text-gray-700 flex items-center gap-2">
              <User size={18} /> Profile
            </div>
            <button 
              onClick={logout} 
              className="w-full text-left px-4 py-2 text-red-500 flex items-center gap-2 hover:bg-red-100 rounded-lg"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
