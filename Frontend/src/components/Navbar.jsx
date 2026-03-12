import React, { useState } from "react";
import { FiShoppingCart, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from "../logo.png";

const Navbar = () => {
  const { cartItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userToken = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-cream dark:bg-gray-900 p-5 flex items-center justify-between shadow-md dark:shadow-none">
      <img src={logo} alt="Company Logo" className="w-16 h-16 object-contain" />

      <input
        type="text"
        placeholder="Search for products, categories..."
        className="flex-grow max-w-2xl mx-6 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-4 focus:ring-fade-orange focus:border-fade-orange
                   transition duration-300 shadow-sm"
      />

      <div className="flex items-center space-x-10 text-warm-gray dark:text-gray-300 relative">
        <button
          onClick={() => navigate("/cart")}
          className="relative group p-2 rounded-full hover:bg-fade-orange/20 transition"
          aria-label="Cart"
          title="View Cart"
        >
          <FiShoppingCart
            size={26}
            className="text-gray-700 dark:text-gray-200 group-hover:text-fade-orange"
          />
          {cartItems.length > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold
                         w-5 h-5 flex items-center justify-center rounded-full shadow-md"
            >
              {cartItems.length}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-fade-orange/20 transition"
            aria-label="Account"
            title="Account"
          >
            <FiUser
              size={26}
              className="text-gray-700 dark:text-gray-200 hover:text-fade-orange transition"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {userToken ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-fade-orange/20 transition"
          aria-label="Toggle Dark Mode"
          title="Toggle Light/Dark Mode"
        >
          {darkMode ? (
            <FiSun size={26} className="text-yellow-400" />
          ) : (
            <FiMoon size={26} className="text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
