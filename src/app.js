import express from "express";
import cookieParser from "cookie-parser";
import path from "path"; 
import __dirname from "./utils/index.js"; 

// Rutas importadas
import usersRouter from "./routers/user.router.js";
import menuItemsRouter from "./routers/menuItem.router.js"; 
import ordersRouter from "./routers/order.router.js";       
import restaurantsRouter from "./routers/restaurant.router.js"; 
import sessionsRouter from "./routers/sessions.router.js";
import mocksRouter from "./routers/mocks.router.js"; // <-- NUEVO

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

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Swagger
setupSwagger(app);

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/menu-items", menuItemsRouter); 
app.use("/api/orders", ordersRouter);       
app.use("/api/restaurants", restaurantsRouter); 
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter); // <-- NUEVO

export default app;