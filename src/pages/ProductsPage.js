import { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import $ from "jquery";
import AddProduct from "./AddProduct";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Live");

  DataTable.use(DT);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Cherry Pie", image: "https://placehold.co/600x400.png", status: "Available", createdOn: "2024-02-08" },
        { id: 2, name: "Blue Dream", image: "https://placehold.co/600x400.png", status: "Out of Stock", createdOn: "2024-02-07" },
        { id: 3, name: "Green Crack", image: "https://placehold.co/600x400.png", status: "Pending", createdOn: "2024-02-06" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const toggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "Available"
                  ? "Out of Stock"
                  : product.status === "Out of Stock"
                  ? "Available"
                  : "Pending",
            }
          : product
      )
    );
    toast.success("Status updated!");
  };

  const handleView = (id) => {
    toast.success(`Viewing product ID: ${id}`);
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
      data: "image",
      render: (data) => `<img src='${data}' class='w-12 h-12 rounded-lg'/>`,
    },
    { title: "Name", data: "name" },
    { title: "Created On", data: "createdOn" },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) =>
        `<button class='status-btn px-3 py-1 rounded-full text-sm font-medium ${
          data == "Available"
            ? "bg-green-200 text-green-800"
            : data == "Out of Stock"
            ? "bg-red-200 text-red-800"
            : "bg-yellow-200 text-yellow-800"
        }'>${data}</button>`,
    },
    {
      title: "Actions",
      data: "id",
      render: (id) =>
        `<div class="flex gap-2">
          <button class="view-btn text-blue-500">View</button>
          <button class="edit-btn text-green-500">Edit</button>
          <button class="delete-btn text-red-500">Delete</button>
        </div>`,
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
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
            } mx-1`}
          >
            {tab}
          </button>
        ))}
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
            data={products.filter((product) => (activeTab === "Live" ? product.status !== "Pending" : product.status === "Pending"))}
            columns={columns}
            options={{
              pageLength: 10,
              ordering: true,
              createdRow: (row, data) => {
                $(row).find(".status-btn").on("click", () => toggleStatus(data.id));
                $(row).find(".view-btn").on("click", () => handleView(data.id));
                $(row).find(".edit-btn").on("click", () => handleEdit(data.id));
                $(row).find(".delete-btn").on("click", () => handleDelete(data.id));
              },
            }}
          />
        )}
      </div>

      {addFormOpen && <AddProduct onClose={() => setAddFormOpen(false)} />}
    </div>
  );
};

export default ProductsPage;
