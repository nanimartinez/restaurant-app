import { ordersService, usersService, menuItemsService, restaurantsService } from "../services/index.js";

const getAllOrders = async (req, res) => {
    const result = await ordersService.getAll();
    res.send({ status: "success", payload: result });
};

const getOrder = async (req, res) => {
    const orderId = req.params.oid;
    const order = await ordersService.getBy({ _id: orderId });
    if (!order) return res.status(404).send({ status: "error", error: "Order not found" });
    res.send({ status: "success", payload: order });
};

const createOrder = async (req, res) => {
    const { userId, restaurantId, items } = req.body;

    // Validaciones
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    
    const restaurant = await restaurantsService.getBy({ _id: restaurantId });
    if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

    if (!items || items.length === 0) {
        return res.status(400).send({ status: "error", error: "Order must have at least one item" });
    }

    // Procesar items y calcular total
    let totalPrice = 0;
    const processedItems = [];

    for (const item of items) {
        const menuItem = await menuItemsService.getBy({ _id: item.menuItemId });
        if (!menuItem) {
            return res.status(404).send({ status: "error", error: `Menu item with id ${item.menuItemId} not found` });
        }
        totalPrice += menuItem.price * item.quantity;
        processedItems.push({
            menuItem: menuItem._id,
            quantity: item.quantity,
            price: menuItem.price // Guardar el precio actual
        });
    }

    const orderData = {
        user: userId,
        restaurant: restaurantId,
        items: processedItems,
        totalPrice,
        status: 'pending'
    };

    const result = await ordersService.create(orderData);
    res.send({ status: "success", payload: result });
};

const updateOrderStatus = async(req, res) => {
    const { status } = req.body;
    const orderId = req.params.oid;
    
    if (!['preparing', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).send({ status: "error", error: "Invalid status" });
    }

    const result = await ordersService.update(orderId, { status });
    res.send({ status: "success", message: "Order status updated" });
}

export default {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrderStatus
};