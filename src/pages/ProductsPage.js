import { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net";
import { Plus, Eye, Edit, Trash2, RefreshCcw } from "lucide-react";
import $ from "jquery";
import AddProduct from "./AddProduct";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import StrainDetails from "./StrainDetails";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [detailsTabOpen, setDetailsTabOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("Live");
  const { user } = useAuth();

  DataTable.use(DT);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ryupunch.com/leafly/api/Product/list_strains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await response.json();

      if (result.status) {
        setProducts(result.data);
      } else {
        toast.error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    

    fetchProducts();
  }, [user.token]);

  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock == 1 ? 0 : 1; // Toggle stock status
  
    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Product/update_strain_stock",
        { strain_id: id, stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.status) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, stock: newStock } : product
          )
        );
        toast.success("Stock status updated!");
      } else {
        toast.error("Failed to update stock status!");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Something went wrong!");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus == 1 ? 0 : 1; // Toggle stock status
  
    try {
      const response = await axios.post(
        "https://ryupunch.com/leafly/api/Product/update_strain_status",
        { strain_id: id, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.status) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, status: newStatus } : product
          )
        );
        toast.success("Status updated!");
      } else {
        toast.error("Failed to update strain!");
      }
    } catch (error) {
      console.error("Error updating strain:", error);
      toast.error("Something went wrong!");
    }
  };
  

  const handleView = (id) => {
    setSelectedId(id);
    setDetailsTabOpen(true);
  };

  const handleEdit = (id) => {
    toast.success(`Editing product ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast.error("Product deleted!");
    }
  };

  const columns = [
    {
      title: "Image",
      data: "images",
      render: (data) => {
        try {
          const imagesArray = JSON.parse(data); // Parse the string into an array
          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            const imageUrl = `https://ryupunch.com/leafly/uploads/products/${imagesArray[0]}`;
            return `<img src='${imageUrl}' class='w-12 h-12 rounded-lg' onerror="this.onerror=null;this.src='https://placehold.co/50x50?text=No+Image';"/>`;
          }
        } catch (error) {
          console.error("Error parsing images:", error);
        }
        return `<img src='https://placehold.co/50x50?text=No+Image' class='w-12 h-12 rounded-lg'/>`;
      },
    },
    { title: "Name", data: "name" },
    {
      title: "Created On",
      data: "created_at",
      render: (data) => {
        if (!data) return "N/A"; // Handle missing data
        const date = new Date(data);

        // Format: "10 Feb, 2025"
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return formattedDate;
      },
    },
    {
      title: "Status",
      data: null, // Use `null` since we are computing it dynamically
      render: (data, type, row) => {
        let displayText = row.status == 0
          ? "Pending"
          : row.stock == 1
            ? "Stock Available"
            : "Out of Stock";

        let bgColor = row.status == 0
          ? "bg-yellow-200 text-yellow-800"
          : row.stock == 1
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800";

        return `<button class='${row.status == 1 ? 'stock-btn' : ''} px-3 py-1 rounded-full text-sm font-medium ${bgColor}'>${displayText}</button>`;
      },
    },

    {
      title: "Actions",
      data: null, // Use `null` to access the entire row
      render: (row) => {
        return `
          <div class="flex gap-2">
            <button class="view-btn bg-blue-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-600 transition">
              View
            </button>
            ${row.status != 1 ? `
            <button class="edit-btn bg-orange-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-orange-600 transition">
              Edit
            </button>` : ""}
            <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        `;
      },
    },
    
    
  ];

  return (
    <div className="px-3 py-3 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white rounded px-2 py-2">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          className="flex items-center gap-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => setAddFormOpen(true)}
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="flex mb-4">
        {["Live", "Pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-lg ${activeTab === tab ? "bg-green-800 text-white" : "bg-gray-300 text-gray-800"
              } mx-1`}
          >
            {tab}
          </button>
        ))}
        <button onClick={fetchProducts} className={` bg-gray-200 text-gray-700 px-2 py-1 rounded-xl`} >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''}/>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton width={50} height={50} />
                <Skeleton width={250} />
                <Skeleton width={80} />
                <Skeleton width={100} />
                <Skeleton width={100} />
                <Skeleton width={100} />
                <Skeleton width={100} />
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            data={products.filter((product) => (activeTab === "Live" ? product.status != "0" : product.status == "0"))}
            columns={columns}
            options={{
              pageLength: 10,
              ordering: true,
              createdRow: (row, data) => {
                $(row).find(".stock-btn").on("click", () => toggleStock(data.id, data.stock));
                $(row).find(".view-btn").on("click", () => handleView(data.id));
                $(row).find(".edit-btn").on("click", () => handleEdit(data.id));
                $(row).find(".delete-btn").on("click", () => handleDelete(data.id));
              },
            }}
          />
        )}
      </div>
      <AnimatePresence>
        {addFormOpen && <AddProduct onClose={() => setAddFormOpen(false)} finalfunction={fetchProducts}/>}

        {detailsTabOpen && (
          <StrainDetails strainId={selectedId} onClose={() => { setDetailsTabOpen(false) }} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
