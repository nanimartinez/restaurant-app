import mongoose from "mongoose";

const collection = "Orders";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
    required: true,
  },
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  items: [
    {
      menuItem: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "MenuItems",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: { // Precio en el momento de la compra
        type: Number,
        required: true,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "completed", "cancelled"],
    default: "pending",
  }
}, { timestamps: true }); // timestamps añade createdAt y updatedAt

const orderModel = mongoose.model(collection, schema);

export default orderModel;