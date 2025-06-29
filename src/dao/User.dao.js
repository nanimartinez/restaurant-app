import userModel from "./models/User.js"; 

export default class UsersDAO {
  get = (params) => {
    return userModel.find(params);
  };

  getBy = (params) => {
    return userModel.findOne(params);
  };

  save = (doc) => {
    return userModel.create(doc);
  };

  update = (id, doc) => {
    return userModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return userModel.findByIdAndDelete(id);
  };

  // Método adicional que necesita el repositorio de usuarios
  addDocuments = async (uid, documents) => {
      const user = await userModel.findById(uid);
      if (user) {
          user.documents.push(...documents);
          await user.save();
      }
      return user;
  }
}