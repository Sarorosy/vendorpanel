import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const VendorLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex flex-col flex-1">
        <Header />
        
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
