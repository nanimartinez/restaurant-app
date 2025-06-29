import menuItemModel from "./models/MenuItem.js";

export default class MenuItemsDAO {
  get = (params) => {
    return menuItemModel.find(params);
  };

  getBy = (params) => {
    return menuItemModel.findOne(params);
  };

  save = (doc) => {
    return menuItemModel.create(doc);
  };

  update = (id, doc) => {
    return menuItemModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return menuItemModel.findByIdAndDelete(id);
  };
}