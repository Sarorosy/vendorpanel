import { useState } from "react";

const Profile = () => {
    const [formData, setFormData] = useState({
        storeName: "",
        email: "",
        phone: "",
        address: "",
        gstNumber: "",
        license: null,
        idProof: null,
        storeImage: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted: ", formData);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Store Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Store Name</label>
                    <input type="text" name="storeName" className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Email</label>
                        <input type="email" name="email" className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                        <input type="text" name="phone" className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <textarea name="address" className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" onChange={handleChange} required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">GST Number</label>
                    <input type="text" name="gstNumber" className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600" onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Store License (PDF)</label>
                        <div className="relative flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                            <span className="text-sm text-gray-600">
                                {formData.license ? formData.license.name : "No file chosen"}
                            </span>
                            <input
                                type="file"
                                name="license"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">ID Proof (PDF/Image)</label>
                        <div className="relative flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                            <span className="text-sm text-gray-600">
                                {formData.idProof ? formData.idProof.name : "No file chosen"}
                            </span>
                            <input
                                type="file"
                                name="idProof"
                                accept=".pdf,.jpg,.png"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700">Store Image</label>
                    <div className="relative flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-sm text-gray-600">
                            {formData.storeImage ? formData.storeImage.name : "No file chosen"}
                        </span>
                        <input
                            type="file"
                            name="storeImage"
                            accept=".jpg,.png"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition-all duration-300 shadow-md">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;