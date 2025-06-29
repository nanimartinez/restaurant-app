import orderModel from "./models/Order.js";

export default class OrdersDAO {
  get = (params) => {
    return orderModel.find(params).populate('user').populate('restaurant').populate('items.menuItem');
  };

  getBy = (params) => {
    return orderModel.findOne(params).populate('user').populate('restaurant').populate('items.menuItem');
  };

  save = (doc) => {
    return orderModel.create(doc);
  };

  update = (id, doc) => {
    return orderModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return orderModel.findByIdAndDelete(id);
  };
}