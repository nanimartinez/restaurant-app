import { usersService } from "../services/index.js";
// import User from "../dao/models/User.js";
// import __dirname from "../utils/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.grave("Error al obtener usuarios", { error: error.message });
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warn(`Usuario no encontrado con ID: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.grave(`Error al obtener usuario ${req.params.uid}`, { error: error.message });
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    
    const result = await usersService.update(userId, updateBody);

    if (!result) {
        req.logger.warn(`Intento de actualizar usuario no encontrado con ID: ${userId}`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }
    
    res.send({ status: "success", message: "User updated", payload: result });
  } catch (error) {
    req.logger.grave(`Error al actualizar usuario ${req.params.uid}`, { error: error.message });
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const result = await usersService.delete(userId);

    if (!result) {
        req.logger.warn(`Intento de eliminar usuario no encontrado con ID: ${userId}`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }
    
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    req.logger.grave(`Error al eliminar usuario ${req.params.uid}`, { error: error.message });
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};


//* Controller para subir documentos, ahora respetando la arquitectura.
const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send({ status: "error", error: "No files uploaded" });
    }

    
    const documents = files.map((file) => ({
      name: file.originalname,
      reference: `/documents/${file.filename}`, 
    }));
    
    
    const user = await usersService.addDocuments(uid, documents);
    
    if (!user) {
        req.logger.warn("Usuario no encontrado al subir documentos", { userId: uid });
        return res.status(404).send({ status: "error", error: "User not found" });
    }

    res.send({
      status: "success",
      message: "Documents uploaded successfully",
      documents: user.documents,
    });
  } catch (error) {
    req.logger.grave("Fallo en carga de documentos", {
      error: error.message,
      stack: error.stack,
      userId: req.params.uid,
    });
    return res.status(500).send({ status: "error", error: "Error uploading documents" });
  }
};


export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  uploadDocuments,
};