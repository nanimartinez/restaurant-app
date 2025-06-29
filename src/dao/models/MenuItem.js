import mongoose from "mongoose";

const collection = "MenuItems";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Entrada", "Plato Principal", "Postre", "Bebida"],
  },
  image: String, // URL a la imagen del platillo
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Restaurants"
  }
});

const menuItemModel = mongoose.model(collection, schema);

export default menuItemModel;