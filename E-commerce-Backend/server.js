import dotenv from "dotenv";
import dns from "dns";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import mpesaroutes from "./routes/mpesa.routes.js";
import express from "express";  // <-- fixed

// Set DNS servers BEFORE any other operations
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

dotenv.config();

const app = express();

//Allowing cross origin between the backend and the frontend
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite default dev server
    "http://localhost:5174", // Alternative Vite port
    "http://localhost:3000"  // Backend same origin
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};



app.use(cors(corsOptions));
app.use(express.json());

// Log every request for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Register routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mpesa", mpesaroutes);

// Start server and attempt DB connection (non-blocking)
const PORT = process.env.PORT || 3000;

// Start server immediately
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Attempting to connect to MongoDB...`);
});

// Try to connect to DB (won't crash server if it fails)
connectDB().catch((err) => {
  console.error("\n⚠️  Warning: MongoDB connection failed");
  console.error("Server is running but database operations will fail");
  console.error("Please check your MongoDB Atlas connection\n");
});
