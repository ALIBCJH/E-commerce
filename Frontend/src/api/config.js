// src/api/config.js
const isDev = import.meta.env.MODE === "development";

// Backend API URL - can be overridden with VITE_API_URL environment variable
// In production, this will be set during Docker build
export const API_URL = import.meta.env.VITE_API_URL || 
  (isDev ? "http://localhost:3000" : "http://localhost:3000");

console.log("API_URL:", API_URL);
