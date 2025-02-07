import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-5">
      <h2 className="text-lg font-bold mb-5">Vendor Panel</h2>
      <ul>
        <li className="mb-3">
          <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
        </li>
        <li>
          <Link to="/orders" className="hover:text-gray-400">Orders</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
