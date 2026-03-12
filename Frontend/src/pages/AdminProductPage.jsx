import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = [
  "Clothes",
  "Electronics",
  "Bags",
  "Beauty Products",
  "Furniture",
  "Stationery",
  "Shoes",
];

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const isValidFilename = (filename) => {
    return (
      filename &&
      !filename.includes("http") &&
      !filename.includes("/") &&
      !filename.includes("\\")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image, description, category } = product;

    if (!name || !price || !image || !description || !category) {
      toast.warning("Please fill in all fields.");
      return;
    }

    if (!isValidFilename(image)) {
      toast.error(
        'Invalid image filename. Use only the filename, e.g., "watch1.png", without URLs or slashes.'
      );
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("Admin not logged in. Please login to continue.");
      return;
    }

    try {
      const imagePath = `/images/${image}`;
      const productData = {
        name,
        price,
        image: imagePath,
        description,
        category,
      };

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Server error: ${res.status}`);
      }

      toast.success("🎉 Product was created successfully!");
      setProduct({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "",
      });

      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <section className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen pt-8 pb-12 px-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <button
        onClick={() => navigate("/")}
        className="mb-6 self-start w-full max-w-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-200 flex justify-center items-center gap-2"
      >
        <FaArrowLeft />
        Back to Home
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-lg space-y-5 hover:shadow-orange-300 transition duration-300"
      >
        <h2 className="text-2xl font-semibold text-orange-600 mb-4 text-center">
          Create New Product
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. Smart Watch X"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Price (Ksh)
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. 4999"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image File Name (inside /public/images)
          </label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. product13.png"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">-- Select a Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Write a short product description..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-200"
        >
          Create Product
        </button>
      </form>
    </section>
  );
};

export default AdminProductPage;
