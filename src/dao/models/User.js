import mongoose from "mongoose";
const collection = "Users";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
    // Los pedidos se vincularán al usuario desde el modelo de Order.
  orders: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Orders",
    },
  ],
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model(collection, schema);
export default userModel;