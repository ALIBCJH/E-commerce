import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          toast.error("❌ Failed to fetch products");
        }
      } catch (err) {
        toast.error("❌ Error fetching products");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    navigate("/admin/createproduct");
  };

  const handleBack = () => {
    navigate("/products");
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId || deleteProductId.length !== 24) {
      toast.warning("⚠️ Enter a valid 24-character Product ID");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${deleteProductId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Delete failed");
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteProductId)
      );
      toast.success("✅ Product deleted successfully!");
      setDeleteProductId("");
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white py-10 px-4">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-full mb-6 transition"
      >
        <FaArrowLeft /> Back to Products
      </button>

      <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          🛠️ Admin Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <button
            onClick={handleCreateProduct}
            className="w-full md:w-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
          >
            <FaPlus className="inline-block mr-2" />
            Create Product
          </button>

          <div className="flex flex-1 flex-col md:flex-row items-stretch md:items-center gap-3">
            <input
              type="text"
              placeholder="Enter Product ID"
              value={deleteProductId}
              onChange={(e) => setDeleteProductId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 disabled:opacity-50"
            >
              <FaTrash className="inline-block mr-2" />
              Delete Product
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">🛍️ All Products</h2>

          {products.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No products available.
            </p>
          ) : (
            <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {product._id}
                    </p>
                  </div>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">
                    Ksh {product.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
