import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Hourglass, CheckCircle, MapPin, DollarSign } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("Fetching location...");
    const [error, setError] = useState(null);

    useEffect(() => {
        getLocation();
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch("https://ryupunch.com/leafly/api/Vendor/get_dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const result = await response.json();
            if (result.status) {
                setDashboardData(result.data);
            } else {
                toast.error(result.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            toast.error("Error fetching dashboard data");
        }
    };

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
                    fetchLocationName(newLocation.lat, newLocation.lng);
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

    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setLocationName(data.display_name);
            } else {
                setLocationName("Location not found");
            }
        } catch (error) {
            setLocationName("Error fetching location");
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

    return (
        <div className="p-6 bg-white text-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Products */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-600">

                        <h2 className="text-xl font-semibold">Pending Products</h2>
                        <Hourglass className="w-6 h-6" />
                    </div>
                    <p className="text-4xl text-gray-700 font-bold mt-2">
                        {dashboardData?.pending || 0}
                    </p>
                    <p className="text-sm text-gray-600">Products awaiting approval</p>
                </div>

                {/* Approved Products */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <h2 className="text-xl font-semibold">Approved Products</h2>
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-4xl text-gray-700 font-bold mt-2">
                        {dashboardData?.approved || 0}
                    </p>
                    <p className="text-sm text-gray-600">Products available for sale</p>
                </div>

                {/* Vendor Location */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <h2 className="text-xl font-semibold">Vendor Location</h2>
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div
                        className="text-xs p-2 text-center bg-green-800 rounded-md cursor-pointer hover:bg-green-700 text-white mt-2"
                        onClick={getLocation}
                    >
                        {error ? error : <div className="flex items-center justify-center space-x-2">
                            {locationName}
                        </div>}
                    </div>
                    <div>
                    <p className="text-sm text-gray-600 ">With this location buyers can see nearby shops</p>
                    </div>
                    
                </div>
                

            </div>
        </div>
    );
}
