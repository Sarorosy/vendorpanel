import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Vendor Dashboard</h1>
      <div>
        <span className="mr-4">{user?.name}</span>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
