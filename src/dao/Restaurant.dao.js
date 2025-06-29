import restaurantModel from "./models/Restaurant.js";

export default class RestaurantsDAO {
  get = (params) => {
    return restaurantModel.find(params).populate('menu');
  };

  getBy = (params) => {
    return restaurantModel.findOne(params).populate('menu');
  };

  save = (doc) => {
    return restaurantModel.create(doc);
  };

  update = (id, doc) => {
    return restaurantModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return restaurantModel.findByIdAndDelete(id);
  };
}