import { useState } from "react";
import { CheckCircle, MapPin, Edit, BadgeCheck, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import EditProfile from "./EditProfile";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const StoreProfileForUser = ({ storeId, onClose }) => {
    const [EditPageOpen, setEditPageOpen] = useState(false);
    const { user } = useAuth();

    const handleEditClick = () => {
        setEditPageOpen(true);
    }

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-2/3 z-50 bg-white shadow-2xl  overflow-y-auto  rounded-l-xl"
        >
            <div className="flex w-full items-center justify-end mt-1">
            <button  onClick={onClose} className=" p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white border border-red-700 transition">
                <X size={20} className="w-6 h-6 " />
            </button>
            </div>
            <div className="border rounded-lg pt-6 px-4 overflow-hidden shadow-lg mt-2">
                {/* Store Banner */}
                <div className="relative h-48 md:h-48 bg-gray-300">
                    {user.banner ? (
                        <img
                            src={"https://ryupunch.com/leafly/uploads/vendors/" + user.banner}
                            alt="Store Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Store Banner
                        </div>
                    )}
                </div>

                <div className="relative pt-16 pb-8 px-4 md:px-6 bg-white">
                    {/* Store Profile Image */}
                    <div className="absolute -top-16 left-4 md:left-6">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                            {user.profile ? (
                                <img
                                    src={"https://ryupunch.com/leafly/uploads/vendors/" + user.profile}
                                    alt="Store Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Store Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Store Details */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div className="flex items-center mb-2 md:mb-0">
                            <h1 className="text-3xl font-bold mr-2">{user.company_name}</h1>
                            {user.status == 1 && <BadgeCheck className="w-6 h-6 text-green-800 rounded-full bg-green-100" />}
                        </div>
                    </div>

                    {/* Store Address */}
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <p>{user.location}</p>
                    </div>

                    {/* Store Description */}
                    <p className="text-gray-600">{user.description}</p>
                </div>
            </div>
            <AnimatePresence>
                {EditPageOpen && (
                    <EditProfile onClose={() => { setEditPageOpen(false) }} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StoreProfileForUser;
