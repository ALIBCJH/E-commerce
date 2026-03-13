import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function AdminSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      alert("Admin registered successfully!");
      navigate("/admin/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Sign Up
        </h2>

        {error && (
          <p className="mb-4 text-red-500 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block mb-1 font-medium capitalize"
              >
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <input
                id={field}
                name={field}
                type={field.includes("password") ? "password" : "text"}
                placeholder={
                  field === "email"
                    ? "admin@example.com"
                    : field === "name"
                    ? "John Doe"
                    : "********"
                }
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-md font-semibold transition-colors ${
              loading
                ? "bg-orange-600 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
