import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Package, ChevronLeft, ChevronRight, LogOut, Store, BadgeCheck, Map, Bell } from "lucide-react";
import cannabislogo from "../assets/weedlogo.svg";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import { AnimatePresence } from "framer-motion";
import NotificationDiv from "./NotificationDiv";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationsDivOpen, setNotificationDivOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch("https://ryupunch.com/leafly/api/Vendor/get_notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.read).length);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className={`h-screen bg-[#1E3A1E] text-white shadow-2xl transition-all duration-300 ${isExpanded ? "w-60" : "w-16"} flex flex-col relative`}>
      {/* Sidebar Header */}
      <div className={`${isExpanded ? "justify-between" : "justify-center"} flex items-center p-3`}>
        {isExpanded && (
          <img src={cannabislogo} alt="LeafLux Logo" className="w-10 h-10 opacity-90 transition-all duration-300 hover:scale-110" />
        )}
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 bg-green-700 hover:bg-green-600 rounded-full transition-transform hover:scale-110">
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2 flex-1 overflow-x-hidden">
        <li>
          <Link to="/dashboard" className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-green-900 transition-all duration-200 hover:pl-5`}>
            <Home size={18} /> {isExpanded && "Dashboard"}
          </Link>
        </li>
        <li>
          <Link to="/products" className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-green-900 transition-all duration-200 hover:pl-5`}>
            <Store size={18} /> {isExpanded && "Manage Store"}
          </Link>
        </li>
        <li>
          <Link to="/map" className={`${isExpanded ? "pl-2" : "justify-center"} flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-green-900 transition-all duration-200 hover:pl-5`}>
            <Map size={18} /> {isExpanded && "Map"}
          </Link>
        </li>
        {/* notification div here with expanded ? : */}
        <li className="relative bg-gray-200 text-gray-900 p-2 rounded-lg hover:bg-gray-300 transition-all duration-200 mx-1">
    <div onClick={() => setNotificationDivOpen(true)} className={`${isExpanded ? "justify-between" : " justify-center"} relative cursor-pointer flex items-center `}>
      <span className="text-sm">{isExpanded ? "Notifications" : ""}</span>
      <div className="flex items-center space-x-2">
        <Bell size={20} className="cursor-pointer hover:text-gray-900 transition duration-200" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount}
        </span>
      </div>
    </div>
  </li>
      </ul>



      {/* User Profile */}
      <Link to="/profile">
        <div className={`${isExpanded ? "flex" : ""} flex justify-center items-center `}>
          <img src={user.profile ? `https://ryupunch.com/leafly/uploads/vendors/${user.profile}` : "https://i.pravatar.cc/40"} alt="User Avatar" className="w-10 h-10 rounded-full border border-white shadow-lg" />
          {isExpanded && <p className="flex items-center ml-2 text-xs font-medium tracking-wide opacity-80">{user.company_name} <BadgeCheck size={19} className="text-green-300 ml-1" /></p>}
        </div>
      </Link>

      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to log out?"
        smallMessage="You will be redirected to the login page."
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Logout Button */}
      <div className="p-3">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 text-sm w-full p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all hover:pl-5">
          <LogOut size={18} /> {isExpanded && "Logout"}
        </button>
      </div>

      <AnimatePresence>
        {notificationsDivOpen && (
          <NotificationDiv onClose={ () =>{ setNotificationDivOpen(false) } } />
        )}
        
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
