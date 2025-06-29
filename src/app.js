// src/app.js
import express from "express";
import cookieParser from "cookie-parser";

// Rutas importadas
import usersRouter from "./routes/users.router.js";
import menuItemsRouter from "./routes/menuItems.router.js"; 
import ordersRouter from "./routes/orders.router.js";       
import restaurantsRouter from "./routes/restaurants.router.js"; 
import sessionsRouter from "./routes/sessions.router.js";

import cors from "./config/cors.js";
import middLogg from "./config/logger.js";
import morgan from "morgan";
const logger = morgan("dev");

const app = express();

import setupSwagger from "./config/swagger.js";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(cors); 
app.use(middLogg);

// Swagger
setupSwagger(app);

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/menu-items", menuItemsRouter); 
app.use("/api/orders", ordersRouter);       
app.use("/api/restaurants", restaurantsRouter); 
app.use("/api/sessions", sessionsRouter);

export default app;