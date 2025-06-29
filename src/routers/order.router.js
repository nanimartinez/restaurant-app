import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";

const router = Router();

router.get("/", ordersController.getAllOrders);
router.get("/:oid", ordersController.getOrder);
router.post("/", ordersController.createOrder);
router.patch("/:oid", ordersController.updateOrderStatus); // Usamos PATCH para actualizaciones parciales

export default router;