// src/pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { FaArrowLeft, FaShoppingCart, FaMobileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../api/config";  // ✅ import API_URL

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const sandboxPhoneNumber = "254797942186"; // Replace with your sandbox phone number

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleMpesaPay = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mpesa/stkpush`, {  // ✅ use API_URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: sandboxPhoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("📲 STK Push sent to your phone");
      } else {
        toast.error(
          `❌ STK Push failed: ${data.details?.errorMessage || data.error}`
        );
      }
    } catch (err) {
      toast.error("⚠️ Network error or server down");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-500 text-xl">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen py-10 px-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className={`mb-6 inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-full ${
            darkMode
              ? "bg-orange-600 hover:bg-orange-500 text-white"
              : "bg-orange-600 hover:bg-orange-700 text-white"
          }`}
        >
          <FaArrowLeft />
          Back to Products
        </button>

        <motion.div
          className="grid md:grid-cols-2 gap-10 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`rounded-3xl overflow-hidden shadow-lg ${
              darkMode
                ? "bg-gray-800 hover:shadow-teal-600"
                : "bg-white hover:shadow-teal-300"
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-contain w-full h-[400px] p-8"
              loading="lazy"
            />
          </motion.div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <div
              className={`rounded-3xl p-6 shadow-lg space-y-4 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-orange-600 font-serif">
                {product.name}
              </h1>

              <p
                className={`text-lg leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {product.description}
              </p>

              <p className="text-2xl font-bold text-teal-500">
                Ksh {product.price.toLocaleString()}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMpesaPay}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full"
                >
                  <FaMobileAlt />
                  Pay with M-Pesa
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full"
                >
                  <FaShoppingCart />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductPage;
