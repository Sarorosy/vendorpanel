import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const VendorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-scroll ">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
