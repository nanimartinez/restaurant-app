import __dirname from "./index.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "others";

    // Cambiado para manejar imágenes de platillos
    if (file.fieldname === "menuImage") {
      folder = "menu-items";
    } else if (file.fieldname === "documents") {
      folder = "documents";
    }
    // Podríamos añadir más carpetas, por ejemplo para fotos de perfil de usuario o de restaurantes
    // else if (file.fieldname === "profileImage") {
    //   folder = "profiles";
    // }

    const dir = path.join(__dirname, "..", "public", folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });
export default uploader;