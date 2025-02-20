import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import taskRoutes from "./routes/tasks.js";
import errorHandler from "./middlewares/errorHandler.js";
import "./config/config.js"; // Import .dotenv config

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "../frontend")));

// API-routes
app.use("/api/tasks", taskRoutes);

// Catch-all route for frontend
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../frontend/index.html"));
});

// Errorhandling middleware
app.use(errorHandler);

export default app;
