import MenuItemDTO from "../dto/MenuItem.dto.js";
import { menuItemsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllMenuItems = async (req, res) => {
  const items = await menuItemsService.getAll();
  res.send({ status: "success", payload: items });
};

const createMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category)
    return res.status(400).send({ status: "error", error: "Incomplete values" });

  const menuItemDTO = MenuItemDTO.getMenuItemInputFrom({ name, description, price, category });
  const result = await menuItemsService.create(menuItemDTO);
  res.send({ status: "success", payload: result });
};

const updateMenuItem = async (req, res) => {
  const itemUpdateBody = req.body;
  const itemId = req.params.mid;
  const result = await menuItemsService.update(itemId, itemUpdateBody);
  res.send({ status: "success", message: "Menu item updated" });
};

const deleteMenuItem = async (req, res) => {
  const itemId = req.params.mid;
  await menuItemsService.delete(itemId);
  res.send({ status: "success", message: "Menu item deleted" });
};

const createMenuItemWithImage = async (req, res) => {
  const file = req.file;
  const { name, description, price, category } = req.body;
  if (!name || !price || !category)
    return res.status(400).send({ status: "error", error: "Incomplete values" });

  const menuItemDTO = MenuItemDTO.getMenuItemInputFrom({
    name,
    description,
    price,
    category,
    image: `${__dirname}/../public/img/menu-items/${file.filename}`,
  });
  const result = await menuItemsService.create(menuItemDTO);
  res.send({ status: "success", payload: result });
};

export default {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createMenuItemWithImage,
};