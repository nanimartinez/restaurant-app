import mongoose from "mongoose";

const collection = "Restaurants";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    phone: String,
    menu: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "MenuItems"
    }]
});

const restaurantModel = mongoose.model(collection, schema);

export default restaurantModel;