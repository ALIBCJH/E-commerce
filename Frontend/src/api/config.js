// src/api/config.js
const isDev = import.meta.env.MODE === "development";

// For local development, always use localhost
export const API_URL = isDev
  ? "http://localhost:3000"
  : "http://localhost:3000"; // Change this to your production API URL when deploying 

