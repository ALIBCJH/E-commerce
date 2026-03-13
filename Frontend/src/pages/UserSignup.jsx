import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext"; // Make sure this exists if using dark mode

const UserSignup = () => {
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users/signup", {
        name,
        email,
        password,
      });

      // You can replace this with toast if desired
      // toast.success("User registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-500 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: "name", type: "text", label: "Name", placeholder: "Your full name" },
            { name: "email", type: "email", label: "Email", placeholder: "example@email.com" },
            { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
            {
              name: "confirmPassword",
              type: "password",
              label: "Confirm Password",
              placeholder: "••••••••",
            },
          ].map((input) => (
            <div key={input.name}>
              <label className="block mb-1 text-sm font-medium">
                {input.label}
              </label>
              <input
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={formData[input.name]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-100 border-gray-300 text-black"
                }`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold text-white py-3 rounded-xl transition ${
              loading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-500 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
