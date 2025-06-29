import { Router } from "express";
import menuItemsController from "../controllers/menuItems.controller.js";
import uploader from "../utils/uploader.js";

const router = Router();

router.get("/", menuItemsController.getAllMenuItems);
router.post("/", menuItemsController.createMenuItem);
router.post(
  "/withimage",
  uploader.single("menuImage"), // Cambiado de 'image' a 'menuImage'
  menuItemsController.createMenuItemWithImage
);
router.put("/:mid", menuItemsController.updateMenuItem);
router.delete("/:mid", menuItemsController.deleteMenuItem);

export default router;