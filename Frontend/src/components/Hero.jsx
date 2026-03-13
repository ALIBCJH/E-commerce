// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_URL } from "../api/config";

const categories = [
  "All",
  "Clothes",
  "Electronics",
  "Bags",
  "Beauty Products",
  "Furniture",
  "Stationery",
  "Shoes",
];

const shuffleArray = (array) =>
  array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false); // for mobile hamburger

  const fetchProducts = async (category) => {
    try {
      const URL =
        category === "All"
          ? `${API_URL}/api/products`
          : `${API_URL}/api/products?category=${encodeURIComponent(category)}`;
      const res = await fetch(URL);
      const json = await res.json();

      if (json.success) {
        setProducts(shuffleArray(json.data));
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="flex flex-col md:flex-row bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen pt-2 pb-16 px-6">
      {/* Sidebar for desktop */}
      <aside className="w-48 sticky top-20 self-start pr-6 hidden md:flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-4 border-b border-orange-400 pb-2">
          Categories
        </h2>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-left font-medium cursor-pointer px-2 py-1 rounded-md transition-colors duration-300 ${
              selectedCategory === category
                ? "bg-orange-200 dark:bg-orange-600 text-orange-900 dark:text-white font-bold"
                : "text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-yellow-400 hover:bg-orange-100 dark:hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </aside>

      {/* Mobile Hamburger */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        {menuOpen && (
          <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 shadow-md rounded-md z-10 flex flex-col space-y-2 p-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setMenuOpen(false);
                }}
                className={`text-left font-medium cursor-pointer px-2 py-1 rounded-md transition-colors duration-300 ${
                  selectedCategory === category
                    ? "bg-orange-200 dark:bg-orange-600 text-orange-900 dark:text-white font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-yellow-400 hover:bg-orange-100 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center">
        {/* Title */}
        <div className="w-full max-w-7xl text-center mb-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 dark:from-orange-300 dark:to-yellow-300">
            Chuo Market
          </h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {selectedCategory === "All"
              ? "Discover our curated selection of Products from top local vendors."
              : `Browse our best ${selectedCategory} picks just for you.`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-7xl">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transform transition-transform hover:scale-105"
            >
              <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                NEW
              </span>

              <Link to={`/product/${product._id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-contain bg-white dark:bg-gray-700 p-6 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="px-6 py-4">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white truncate tracking-wide leading-tight font-serif">
                    {product.name}
                  </h2>
                  <p className="text-orange-600 dark:text-orange-400 font-bold mt-1 text-lg font-mono tracking-tight">
                    Ksh {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>

              <div className="px-6 pb-4 flex justify-between gap-2">
                <Link
                  to={`/product/${product._id}`}
                  className="w-1/2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full text-center transition-all duration-300"
                >
                  Product Details
                </Link>
              </div>

              <div className="px-6 pb-6 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Sold by: Juma</span>
                <button>
                  <FaHeart className="text-pink-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Hero;
