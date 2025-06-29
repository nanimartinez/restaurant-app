export default class MenuItemDTO {
  static getMenuItemInputFrom = (item) => {
    return {
      name: item.name || "",
      description: item.description || "",
      price: parseFloat(item.price) || 0,
      category: item.category || "Plato Principal",
      image: item.image || "",
    };
  };
}